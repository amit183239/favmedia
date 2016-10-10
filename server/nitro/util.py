import types
from contextlib import contextmanager

__all__ = [
    "unused",
    "assertType", "assertTypeOneOf", "assertOneOf",
    "assertInt", "assertPositiveInt",
    "ContextStack", "context_stack",
]


#
# unused
#

def unused(_) :
    pass


#
# 
# assertType, assertTypeOneOf, assertOneOf, assertPositiveInt
#

def assertType(value, type) :
    if not isinstance(value, type) :
        msg = "expected type %s, but received %s"
        raise TypeError(msg % (type, repr(value)))

def assertTypeOneOf(value, types) :
    if not isinstance(value, types) :
        msg = "expected one of types %s, but received %s"
        raise TypeError(msg % (types, repr(value)))

def assertOneOf(value, values) :
    if not value in values :
        msg = "expected one of %s, but received %s"
        raise ValueError(msg % (values, value))

def assertInt(value) :
    assertTypeOneOf(value, (types.IntType, types.LongType))

def assertPositiveInt(value) :
    assertInt(value)
    if value < 0 :
        msg = "positive integer expected, but received: %s"
        raise ValueError(msg % (value,))


#
# ContextStack, context_stack
#

class ContextStack(object) :
    def __init__(self) :
        self._marks = []
        self._stack = []

    def push(self, name) :
        assert len(self._marks) > 0
        self._stack.append(name)

    def pop(self) :
        self._stack.pop()

    def mark(self) :
        self._marks.append(len(self._stack))

    def restore(self) :
        old_size = self._marks.pop()
        assert old_size <= len(self._stack)
        del self._stack[old_size:]

    def stack(self) :
        return self._stack[:]

    @contextmanager
    def entry(self, name) :
        self.push(name)
        yield
        self.pop()

    def safe_call(self, func) :
        self.mark()
        try :
            return func()
        except Exception :
            print "Error context:"
            for x in self.stack() :
                print "\t%s" % (x,)
            raise

context_stack = ContextStack()
