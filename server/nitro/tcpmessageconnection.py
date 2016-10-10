import time
from nitro.log import safe_callback
from nitro.util import *
from nitro.serialization import *
from nitro.tcpconnection import TCPConnection


__all__ = [
    "MessageTooLargeError", "RemoteClosedError",
    "TCPMessageConnection"
]

class MessageTooLargeError(Exception) :
    pass

class RemoteClosedError(Exception) :
    pass

class KeepaliveFailedError(Exception) :
    pass

class TCPMessageConnection(object) :
    def __init__(self, socket, io_loop, message_callback, error_callback) :
        self._io_loop = io_loop
        self._message_callback = message_callback
        self._error_callback = error_callback
        self._keepalive_time = None
        self._keepalive_timer = None
        self._keepalive_attempts = None
        self._keepalive_max_attempts = 2
        self._max_message_size = 8 * 1024 * 1024
        self._conn = TCPConnection(
            socket, io_loop, self._on_data_received, self._on_error
        )
        self._conn.register_activity_callback(self._on_activity)
        self._conn.start_receive()

        self._size = None
        self._data = ""

    def close(self) :
        assert self._conn is not None
        self.disable_keepalive()
        self._conn.close()
        self._conn = None

    def enable_keepalive(self, keepalive_time) :
        assert keepalive_time is not None
        if self._keepalive_time is not None :
            assert self._keepalive_timer is not None
            self._io_loop.remove_timeout(self._keepalive_timer)
        self._keepalive_time = keepalive_time
        self._keepalive_timer = self._io_loop.add_timeout(
            time.time() + self._keepalive_time,
            self._on_keepalive_timer
        )
        self._keepalive_attempts = 0

    def disable_keepalive(self) :
        if self._keepalive_time is not None :
            assert self._keepalive_timer is not None
            self._io_loop.remove_timeout(self._keepalive_timer)
            self._keepalive_time = None
            self._keepalive_timer = None
            self._keepalive_attempts = None

    def send_message(self, data) :
        assert self._conn is not None
        self._conn.write(serialize_uint32(len(data)) + data)

    def _on_data_received(self, data) :
        if len(data) == 0 :
            # eof received
            self.close()
            error = RemoteClosedError("remote end closed")
            safe_callback(self._error_callback, error)
            return
        self._data += data
        while self._conn is not None :
            if not self._parse_message() :
                break

    def _parse_message(self) :
        if self._size is None :
            if len(self._data) >= 4 :
                header_data = self._data[:4]
                self._data = self._data[4:]
                header_value = deserialize_uint32(header_data)
                if header_value == 0xFFFFFFFF :
                    # keep-alive request
                    self._conn.write(serialize_uint32(0xFFFFFFFE))
                    return True
                elif header_value == 0xFFFFFFFE :
                    # keep-alive response
                    return True
                self._size = header_value
                if self._size > self._max_message_size :
                    template = (
                        "received message size %s is greater than " +
                        "maximum message size %s"
                    )
                    error_msg = template % (self._size, self._max_message_size)
                    error = MessageTooLargeError(error_msg)
                    self.close()
                    safe_callback(self._error_callback, error)
                    return False
        if self._size is not None :
            if len(self._data) >= self._size :
                message = self._data[:self._size]
                self._data = self._data[self._size:]
                self._size = None
                safe_callback(self._message_callback, message)
                return True
        return False

    def _on_error(self, error) :
        # TCPConnection is already closed
        self.disable_keepalive()
        self._conn = None
        safe_callback(self._error_callback, error)

    def _on_activity(self) :
        if self._keepalive_time is not None :
            assert self._keepalive_timer is not None
            self._io_loop.remove_timeout(self._keepalive_timer)
            self._keepalive_timer = self._io_loop.add_timeout(
                time.time() + self._keepalive_time,
                self._on_keepalive_timer
            )
            self._keepalive_attempts = 0

    def _on_keepalive_timer(self) :
        assert self._conn is not None
        assert self._keepalive_time is not None
        self._keepalive_timer = None
        self._keepalive_timer = self._io_loop.add_timeout(
            time.time() + self._keepalive_time,
            self._on_keepalive_timer
        )
        self._keepalive_attempts += 1
        self._conn.write(serialize_uint32(0xFFFFFFFF))
        if self._keepalive_attempts > self._keepalive_max_attempts :
            error_msg = "keepalive failed"
            error = KeepaliveFailedError(error_msg)
            self.close()
            safe_callback(self._error_callback, error)
