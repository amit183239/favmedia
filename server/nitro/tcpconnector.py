import socket
import errno
from nitro.log import safe_callback
from nitro.util import *
from nitro.socketutil import *
from nitro.async import *


__all__ = [
    "TCPConnector", "tcp_connect"
]


#
# TCPConnector
#

class TCPConnector(object) :
    #
    # connect_callback: (socket) -> ()
    # error_callback: (exception) -> ()
    #
    def __init__(self, io_loop, connect_callback, error_callback) :
        self._io_loop = io_loop
        self._connect_callback = connect_callback
        self._error_callback = error_callback
        self._socket = None
        self._handler_added = False

    def connect(self, connect_address) :
        #
        # reference: http://cr.yp.to/docs/connect.html
        #
        assert self._socket is None
        self._socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM, 0)
        socket_set_blocking(self._socket, False)
        try :
            self._socket.connect(connect_address)
        except socket.error, e :
            if e.args[0] in [errno.EINPROGRESS, errno.EWOULDBLOCK, errno.EAGAIN] :
                self._io_loop.add_handler(
                    self._socket.fileno(), self._event_handler, self._io_loop.WRITE
                )
                self._handler_added = True
            else :
                def notify_error() :
                    if self._socket is None :
                        return
                    self._close_socket()
                    safe_callback(self._error_callback, e)
                self._io_loop.add_callback(notify_error)

    def close(self) :
        self._close_socket()

    def _close_socket(self) :
        assert self._socket is not None
        if self._handler_added :
            self._handler_added = False
            self._io_loop.remove_handler(self._socket.fileno())
        close_ignoring_errors(self._socket)
        self._socket = None

    def _event_handler(self, fd, events) :
        unused(fd)
        if self._socket is None :
            return
        self._io_loop.remove_handler(self._socket.fileno())
        self._handler_added = False
        if events & self._io_loop.ERROR :
            error = socket_error(self._socket)
            assert error is not None
            self._close_socket()
            safe_callback(self._error_callback, error)
            return
        if events & self._io_loop.WRITE :
            error = socket_error(self._socket)
            if error is not None :
                self._close_socket()
                safe_callback(self._error_callback, error)
                return
            sock = self._socket
            self._socket = None
            safe_callback(self._connect_callback, sock)


#
# tcp_connect
#
# callback: (socket, exception) -> ()
#
# on success: callback(socket, None)
# on failure: callback(None, error)
#

def tcp_connect(io_loop, address, callback) :
    def on_connect(socket) :
        async.complete(socket, None)
    def on_connect_error(exception) :
        async.complete(None, exception)
    connector = TCPConnector(io_loop, on_connect, on_connect_error)
    connector.connect(address)
    async = Async(callback, connector.close)
    return async
