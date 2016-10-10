
__all__ = [
    "Async"
]


#
# Async
#

class Async(object) :
    ACTIVE = ["Async.ACTIVE"]
    COMPLETED = ["Async.COMPLETED"]
    CANCELLED = ["Async.CANCELLED"]

    def __init__(
        self,
        completion_callback=None,
        cancellation_callback=None
    ) :
        self._completion_callback = completion_callback
        self._cancellation_callback = cancellation_callback
        self._state = Async.ACTIVE

    def set_completion_callback(self, completion_callback) :
        self._completion_callback = completion_callback

    def set_cancellation_callback(self, cancellation_callback) :
        self._cancellation_callback = cancellation_callback

    def complete(self, *args, **kwargs) :
        assert self._state is Async.ACTIVE
        self._state = Async.COMPLETED
        f = self._completion_callback
        self._completion_callback = None
        self._cancellation_callback = None
        f(*args, **kwargs)

    def cancel(self) :
        assert self._state is Async.ACTIVE
        self._state = Async.CANCELLED
        f = self._cancellation_callback
        self._completion_callback = None
        self._cancellation_callback = None
        f()
