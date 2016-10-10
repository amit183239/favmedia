import socket
import errno
from nitro.log import safe_callback
from nitro.util import *
from nitro.socketutil import *


__all__ = [
    "TCPAcceptor"
]


class TCPAcceptor(object) :
    #
    # accept_callback: (client_socket, client_address) -> ()
    # error_callback: (exception) -> ()
    #
    def __init__(self, io_loop, accept_callback, error_callback) :
        self._io_loop = io_loop
        self._accept_callback = accept_callback
        self._error_callback = error_callback
        self._socket = None
        self._accepting = False

    #
    # this method can throw if the bind fails.
    #
    def listen(self, listen_address, start=True) :
        assert self._socket is None
        assert not self._accepting
        self._socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM, 0)
        self._socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        socket_set_blocking(self._socket, False)
        self._socket.bind(listen_address)
        self._socket.listen(128)
        if start :
            self.start()

    def start(self) :
        assert self._socket is not None
        assert not self._accepting
        self._accepting = True
        fd = self._socket.fileno()
        def read_handler(fd, events) :
            unused(fd)
            unused(events)
            self._ready_for_accept()
        self._io_loop.add_handler(fd, read_handler, self._io_loop.READ)

    def stop(self) :
        assert self._socket is not None
        assert self._accepting
        self._accepting = False
        self._io_loop.remove_handler(self._socket.fileno())

    def close(self) :
        assert self._socket is not None
        if self._accepting :
            self.stop()
        close_ignoring_errors(self._socket)
        self._socket = None

    def _ready_for_accept(self) :
        while self._accepting :
            try :
                client_socket, client_address = self._socket.accept()
            except socket.error, e :
                if e.args[0] in [errno.EWOULDBLOCK, errno.EAGAIN] :
                    return
                else :
                    safe_callback(self._error_callback, e)
                    return
            socket_set_blocking(client_socket, False)
            safe_callback(
                self._accept_callback, client_socket, client_address
            )
