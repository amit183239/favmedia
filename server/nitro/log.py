import logging

__all__ = [
    "logger", "set_logger",
    "stack_trace_enabled", "enable_stack_trace", "disable_stack_trace",
    "log_info", "log_error", "log_exception",
    "safe_callback"
]


#
# logger
#

_logger = logging.getLogger("nitro")
_log_stack_trace = True

def logger() :
    return _logger

def set_logger(logger) :
    global _logger
    _logger = logger

def stack_trace_enabled() :
    return _log_stack_trace

def enable_stack_trace() :
    global _log_stack_trace
    _log_stack_trace = True

def disable_stack_trace() :
    global _log_stack_trace
    _log_stack_trace = False

def log_info(msg, *args) :
    _logger.info(msg, *args)

def log_error(msg, *args) :
    _logger.error(msg, *args)

def log_exception(msg, *args) :
    _logger.error(msg, *args, exc_info=_log_stack_trace)


#
# safe_callback
#

def safe_callback(callback, *args) :
    try :
        callback(*args)
    except Exception, e :
        log_exception("Exception in callback %r: %s", callback, e)
