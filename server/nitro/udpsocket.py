import socket
import errno
from nitro.log import safe_callback
from nitro.util import unused
from nitro.socketutil import close_ignoring_errors, socket_set_blocking

__all__ = [
    "UDPSocket"
]


def is_blocking_error(socket_error) :
    err = socket_error.args[0]
    return err in (errno.EINPROGRESS, errno.EWOULDBLOCK, errno.EAGAIN)


#
# UDPSocket
#

class UDPSocket(object) :
    def __init__(self, io_loop) :
        self._io_loop = io_loop
        self._socket = None
        self._local_end_point = None
        self._receive_callback = None
        self._max_receive_size = 16384

    def bind(self, local_end_point) :
        assert self._socket is None
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.bind(local_end_point)
        socket_set_blocking(sock, False)
        local_end_point = sock.getsockname()
        self._socket = sock
        self._local_end_point = local_end_point

    def local_end_point(self) :
        return self._local_end_point

    def close(self) :
        assert self._socket is not None
        if self._receive_callback is not None :
            self._io_loop.remove_handler(self._socket.fileno())
            self._receive_callback = None
        close_ignoring_errors(self._socket)
        self._socket = None
        self._local_end_point = None

    def send(self, data, to_end_point) :
        try :
            self._socket.sendto(data, to_end_point)
        except socket.error, e :
            #
            # If socket send buffer is full internally, we might get
            # would-block error. Ignore this.
            #
            if is_blocking_error(e) :
                return
            raise

    def begin_receive(self, receive_callback) :
        assert self._receive_callback is None
        self._receive_callback = receive_callback
        self._io_loop.add_handler(
            self._socket.fileno(), self._read_handler, self._io_loop.READ
        )

    def _read_handler(self, fd, events) :
        unused(fd)
        if events & self._io_loop.READ :
            n = self._max_receive_size
            while self._socket is not None :
                try :
                    data, from_end_point = self._socket.recvfrom(n)
                except socket.error, e :
                    if is_blocking_error(e) :
                        break
                safe_callback(self._receive_callback, data, from_end_point)
