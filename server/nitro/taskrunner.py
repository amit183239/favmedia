import threading
from nitro.async import *

__all__ = [
    "TaskRunner"
]


#
# TaskThread
#

class TaskThread(threading.Thread) :
    def __init__(self, callable, callback) :
        threading.Thread.__init__(self)
        self.daemon = True
        self._callable = callable
        self._callback = callback

    def run(self) :
        result = None
        exception = None
        try :
            result = self._callable()
        except Exception, e :
            exception = e
        self._callback(result, exception)


#
# TaskRunner
#

class TaskRunner(object) :
    def __init__(self, io_loop) :
        self._io_loop = io_loop

    #
    # callable: () -> ()
    # callback: (result, exception) -> ()
    #
    def run_task(self, callable, callback) :
        cancelled = [False]
        def do_cancel() :
            cancelled[0] = True
        async = Async(callback, do_cancel)

        def io_loop_callback(result, exception) :
            if cancelled[0] :
                return
            async.complete(result, exception)

        def thread_callback(result, exception) :
            self._io_loop.add_callback(
                lambda : io_loop_callback(result, exception)
            )

        thread = TaskThread(callable, thread_callback)
        thread.start()

        return async
