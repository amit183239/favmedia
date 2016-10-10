import socket
import errno
from nitro.log import safe_callback
from nitro.util import *
from nitro.socketutil import *


__all__ = [
    "SocketEvents", "TCPWriter", "TCPReader"
]


#
# SocketEvents
#

class SocketEvents(object) :
    #
    # error_callback: (exception) -> ()
    # read_callback: () -> ()
    # write_callback: () -> ()
    # activity_callback: () -> ()
    #
    def __init__(self, io_loop, socket) :
        self._io_loop = io_loop
        self._socket = socket
        self._error_callback = None
        self._read_callback = None
        self._write_callback = None
        self._activity_callback = None
        self._handler_added = False
        self._update_events()

    def io_loop(self) :
        return self._io_loop

    def socket(self) :
        return self._socket

    def register_error_callback(self, error_callback) :
        self._error_callback = error_callback
        self._update_events()

    def unregister_error_callback(self) :
        self.register_error_callback(None)

    def register_read_callback(self, read_callback) :
        self._read_callback = read_callback
        self._update_events()

    def unregister_read_callback(self) :
        self.register_read_callback(None)

    def register_write_callback(self, write_callback) :
        self._write_callback = write_callback
        self._update_events()

    def unregister_write_callback(self) :
        self.register_write_callback(None)

    def register_activity_callback(self, activity_callback) :
        self._activity_callback = activity_callback

    def unregister_activity_callback(self) :
        self.register_activity_callback(None)

    def notify_error_later(self, error) :
        self._io_loop.add_callback(lambda : self.notify_error(error))

    def notify_error(self, error) :
        if self._error_callback is not None :
            safe_callback(self._error_callback, error)

    def _update_events(self) :
        events = 0
        if self._error_callback is not None :
            events |= self._io_loop.ERROR
        if self._read_callback is not None :
            events |= self._io_loop.READ
        if self._write_callback is not None :
            events |= self._io_loop.WRITE
        fd = self._socket.fileno()
        if events == 0 :
            if self._handler_added :
                self._handler_added = False
                self._io_loop.remove_handler(fd)
        else :
            if self._handler_added :
                self._io_loop.update_handler(fd, events)
            else :
                self._io_loop.add_handler(fd, self._event_handler, events)
                self._handler_added = True

    def _event_handler(self, fd, events) :
        unused(fd)
        if events & self._io_loop.ERROR :
            error = socket_error(self._socket)
            assert error is not None
            safe_callback(self._error_callback, error)
            return
        if events & self._io_loop.READ :
            if self._read_callback is not None :
                safe_callback(self._read_callback)
        if events & self._io_loop.WRITE :
            if self._write_callback is not None :
                safe_callback(self._write_callback)
        if self._activity_callback is not None :
            safe_callback(self._activity_callback)


#
# TCPWriter
#

class TCPWriter(object) :
    #
    # queue_emptied_callback: () -> ()
    #
    def __init__(self, socket, events) :
        self._socket = socket
        self._events = events
        self._queue_emptied_callback = None
        self._shutdown_requested = False
        self._error_occurred = False
        self._queue = []
        self._write_event_registered = False

    def set_queue_emptied_callback(self, queue_emptied_callback) :
        self._queue_emptied_callback = queue_emptied_callback

    #
    # returns True if the data was fully written to the socket
    # without errors before the function returns.
    # returns False otherwise
    # i.e if there was an error or if atleast some of the data was queued
    #
    def write(self, data) :
        if self._error_occurred :
            return False
        assert not self._shutdown_requested
        if len(data) == 0 :
            return True
        if self._write_event_registered :
            self._queue.append(data)
            return False
        while len(data) > 0 :
            try :
                n_sent = self._socket.send(data)
                data = data[n_sent:]
            except socket.error, e :
                if e.args[0] in [errno.EWOULDBLOCK, errno.EAGAIN] :
                    self._queue.append(data)
                    self._events.register_write_callback(self._on_socket_writable)
                    self._write_event_registered = True
                    return False
                self._error_occurred = True
                self._events.notify_error_later(e)
                return False
        return True

    def shutdown_write(self) :
        if self._error_occurred :
            return
        assert not self._shutdown_requested
        self._shutdown_requested = True
        if self._write_event_registered :
            return
        try :
            self._socket.shutdown(socket.SHUT_WR)
        except socket.error, e :
            self._error_occurred = True
            self._events.notify_error_later(e)

    def cleanup(self) :
        if self._write_event_registered :
            self._unregister_write_event()
        self._queue = []

    def _unregister_write_event(self) :
        assert self._write_event_registered
        self._events.unregister_write_callback()
        self._write_event_registered = False

    def _on_socket_writable(self) :
        assert self._write_event_registered
        data = "".join(self._queue)
        self._queue = []
        while len(data) > 0 :
            try :
                n_sent = self._socket.send(data)
                data = data[n_sent:]
            except socket.error, e :
                if e.args[0] in [errno.EWOULDBLOCK, errno.EAGAIN] :
                    self._queue.append(data)
                    return
                self._error_occurred = True
                self._events.notify_error(e)
                return
        self._unregister_write_event()
        if self._shutdown_requested :
            try :
                self._socket.shutdown(socket.SHUT_WR)
            except socket.error, e :
                self._error_occurred = True
                self._events.notify_error(e)
                return
        if self._queue_emptied_callback is not None :
            safe_callback(self._queue_emptied_callback)


#
# TCPReader
#

class TCPReader(object) :
    def __init__(self, socket, events, receive_callback) :
        self._socket = socket
        self._events = events
        self._receive_callback = receive_callback
        self._receiving = False
        self._kickstarting = False
        self._read_event_registered = False

    def start_receive(self) :
        assert not self._receiving
        self._receiving = True
        assert not self._read_event_registered
        self._kickstart()

    def stop_receive(self) :
        assert self._receiving
        self._receiving = False
        self._unregister_read_event()

    def cleanup(self) :
        if self._receiving :
            self.stop_receive()

    def _kickstart(self) :
        if self._kickstarting :
            return
        self._kickstarting = True
        def callback() :
            self._kickstarting = False
            if not self._receiving :
                return
            self._perform_read()
        self._events.io_loop().add_callback(callback)

    def _perform_read(self) :
        data_list = []
        close_received = False
        try :
            while True :
                data = self._socket.recv(65536)
                if not data :
                    close_received = True
                    break
                data_list.append(data)
        except socket.error, e :
            if e.args[0] not in (errno.EWOULDBLOCK, errno.EAGAIN) :
                self._events.notify_error(e)
                return
            self._register_read_event()
        data = "".join(data_list)
        if data :
            safe_callback(self._receive_callback, data)
            if not self._receiving :
                return
        if close_received :
            safe_callback(self._receive_callback, "")
            if self._receiving :
                self.stop_receive()

    def _register_read_event(self) :
        if not self._read_event_registered :
            self._events.register_read_callback(self._perform_read)
            self._read_event_registered = True

    def _unregister_read_event(self) :
        if self._read_event_registered :
            self._read_event_registered = False
            self._events.unregister_read_callback()


#
# TCPConnection
#

class TCPConnection(object) :
    #
    # receive_callback: (data) -> ()
    # error_callback: (exception) -> ()
    # queue_emptied_callback: () -> ()
    # activity_callback: () -> ()
    #
    def __init__(self, socket, io_loop, receive_callback, error_callback) :
        self._socket = socket
        self._io_loop = io_loop
        self._receive_callback = receive_callback
        self._error_callback = error_callback

        self._events = SocketEvents(self._io_loop, self._socket)
        self._events.register_error_callback(self._on_error)
        self._reader = TCPReader(self._socket, self._events, receive_callback)
        self._writer = TCPWriter(self._socket, self._events)

    def set_queue_emptied_callback(self, queue_emptied_callback) :
        assert self._socket is not None
        self._writer.set_queue_emptied_callback(queue_emptied_callback)

    def register_activity_callback(self, activity_callback) :
        self._events.register_activity_callback(activity_callback)

    def unregister_activity_callback(self) :
        self._events.unregister_activity_callback()

    def start_receive(self) :
        assert self._socket is not None
        self._reader.start_receive()

    def stop_receive(self) :
        assert self._socket is not None
        self._reader.stop_receive()

    def write(self, data) :
        assert self._socket is not None
        return self._writer.write(data)

    def shutdown_write(self) :
        assert self._socket is not None
        self._writer.shutdown_write()

    def close(self) :
        assert self._socket is not None
        self._reader.cleanup()
        self._writer.cleanup()
        self._events.unregister_error_callback()
        self._events.unregister_activity_callback()
        close_ignoring_errors(self._socket)
        self._socket = None

    def _on_error(self, error) :
        self.close()
        safe_callback(self._error_callback, error)
