import struct


__all__ = [
    "serialize_int8", "deserialize_int8",
    "serialize_int16", "deserialize_int16",
    "serialize_int32", "deserialize_int32",
    "serialize_int64", "deserialize_int64",

    "serialize_uint8", "deserialize_uint8",
    "serialize_uint16", "deserialize_uint16",
    "serialize_uint32", "deserialize_uint32",
    "serialize_uint64", "deserialize_uint64",

    "serialize_float", "deserialize_float",
    "serialize_double", "deserialize_double",

    "serialize_bool", "deserialize_bool",

    "SerializedOutput",
    "DeserializationError",
    "SerializedInput"
]


#
# serialize_intX, deserialize_intX
#

def serialize_int8(x) :
    return struct.pack("b", x)

def deserialize_int8(s) :
    return struct.unpack("b", s)[0]

def serialize_int16(x) :
    return struct.pack(">h", x)

def deserialize_int16(s) :
    return struct.unpack(">h", s)[0]

def serialize_int32(x) :
    return struct.pack(">i", x)

def deserialize_int32(s) :
    return struct.unpack(">i", s)[0]

def serialize_int64(x) :
    return struct.pack(">q", x)

def deserialize_int64(s) :
    return struct.unpack(">q", s)[0]


#
# serialize_uintX, deserialize_uintX
#

def serialize_uint8(x) :
    return struct.pack("B", x)

def deserialize_uint8(s) :
    return struct.unpack("B", s)[0]

def serialize_uint16(x) :
    return struct.pack(">H", x)

def deserialize_uint16(s) :
    return struct.unpack(">H", s)[0]

def serialize_uint32(x) :
    return struct.pack(">I", x)

def deserialize_uint32(s) :
    return struct.unpack(">I", s)[0]

def serialize_uint64(x) :
    return struct.pack(">Q", x)

def deserialize_uint64(s) :
    return struct.unpack(">Q", s)[0]


#
# serialize_float, deserialize_float,
# serialize_double, deserialize_double
#

def serialize_float(x) :
    return struct.pack(">f", x)

def deserialize_float(s) :
    return struct.unpack(">f", s)[0]

def serialize_double(x) :
    return struct.pack(">d", x)

def deserialize_double(s) :
    return struct.unpack(">d", s)[0]


#
# serialize_bool, deserialize_bool
#

def serialize_bool(x) :
    if x :
        value = 1
    else :
        value = 0
    return serialize_uint8(value)

def deserialize_bool(s) :
    value = deserialize_uint8(s)
    return value != 0


#
# SerializedOutput
#

class SerializedOutput(object) :
    def __init__(self) :
        self._data = []

    def data(self) :
        if len(self._data) != 1 :
            self._data = ["".join(self._data)]
        return self._data[0]

    def write(self, s) :
        self._data.append(s)

    def int8(self, x) :
        self.write(serialize_int8(x))

    def int16(self, x) :
        self.write(serialize_int16(x))

    def int32(self, x) :
        self.write(serialize_int32(x))

    def int64(self, x) :
        self.write(serialize_int64(x))

    def uint8(self, x) :
        self.write(serialize_uint8(x))

    def uint16(self, x) :
        self.write(serialize_uint16(x))

    def uint32(self, x) :
        self.write(serialize_uint32(x))

    def uint64(self, x) :
        self.write(serialize_uint64(x))

    def float(self, x) :
        self.write(serialize_float(x))

    def double(self, x) :
        self.write(serialize_double(x))

    def bool(self, x) :
        self.write(serialize_bool(x))

    def byte_string(self, x) :
        assert type(x) is str
        self.uint32(len(x))
        self.write(x)

    def small_byte_string(self, x) :
        assert type(x) is str
        self.uint8(len(x))
        self.write(x)

    def text(self, x) :
        if type(x) is unicode :
            x = x.encode("utf8")
        self.byte_string(x)

    def small_text(self, x) :
        if type(x) is unicode :
            x = x.encode("utf8")
        self.small_byte_string(x)


#
# DeserializationError
#

class DeserializationError(Exception) :
    def __init__(self, s) :
        Exception.__init__(self, "deserialization error: %s" % (s,))


#
# SerializedInput
#

class SerializedInput(object) :
    def __init__(self, data, offset=0) :
        self._data = data
        self._offset = offset

    def read(self, n) :
        offset = self._offset
        available = len(self._data) - offset
        if available < n :
            template = (
                "insufficient data: " +
                "required %s, but only %s available"
            )
            def bytes_str(n) :
                if n == 1 :
                    return "1 byte"
                return "%s bytes" % (n,)
            message = template % (bytes_str(n), bytes_str(available))
            raise DeserializationError(message)
        s = self._data[offset : offset+n]
        self._offset += n
        return s

    def read_till(self, delimiter) :
        i = self._data.find(delimiter, self._offset)
        if i < 0 :
            msg = "delimiter not found: %s" % (delimiter,)
            raise DeserializationError(msg)
        result = self.read(i - self._offset)
        self.read(len(delimiter))
        return result

    def int8(self) :
        return deserialize_int8(self.read(1))

    def int16(self) :
        return deserialize_int16(self.read(2))

    def int32(self) :
        return deserialize_int32(self.read(4))

    def int64(self) :
        return deserialize_int64(self.read(8))

    def uint8(self) :
        return deserialize_uint8(self.read(1))

    def uint16(self) :
        return deserialize_uint16(self.read(2))

    def uint32(self) :
        return deserialize_uint32(self.read(4))

    def uint64(self) :
        return deserialize_uint64(self.read(8))

    def float(self) :
        return deserialize_float(self.read(4))

    def double(self) :
        return deserialize_double(self.read(8))

    def bool(self) :
        return deserialize_bool(self.read(1))

    def byte_string(self) :
        n = self.uint32()
        return self.read(n)

    def small_byte_string(self) :
        n = self.uint8()
        return self.read(n)

    def text(self) :
        x = self.byte_string()
        try :
            return x.decode("utf8")
        except UnicodeDecodeError, e :
            message = "unicode deserialization error: %s" % (e,)
            raise DeserializationError(message)

    def small_text(self) :
        x = self.small_byte_string()
        try :
            return x.decode("utf8")
        except UnicodeDecodeError, e :
            message = "unicode deserialization error: %s" % (e,)
            raise DeserializationError(message)
