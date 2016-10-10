import os
import socket
from types import *
from nitro.log import log_exception

__all__ = [
    "socket_error", "close_ignoring_errors",
    "socket_set_blocking"
]


def socket_error(sock) :
    errno = sock.getsockopt(socket.SOL_SOCKET, socket.SO_ERROR)
    if errno == 0 :
        return None
    error = socket.error(errno, os.strerror(errno))
    return error

def close_ignoring_errors(sock) :
    try :
        sock.close()
    except socket.error, e :
        log_exception("socket close error: %s", e)

def socket_set_blocking(sock, blocking) :
    assert type(blocking) is BooleanType
    try :
        sock.setblocking(1 if blocking else 0)
    except socket.error, e :
        log_exception("socket_set_blocking error: %s", e)
