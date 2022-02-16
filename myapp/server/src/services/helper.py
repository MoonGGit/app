class Room_manager(type):
    __instances = {}

    def __call__(cls, *args, **kwargs):
        room_num =  kwargs.get('room_num') if len(args) is 0 else args[0]

        if room_num not in cls.__instances:
            cls.__instances[room_num] = super().__call__(*args, **kwargs)

        return cls.__instances[room_num]

class Room(metaclass=Room_manager):
    def __init__(self, room_num : int):
        self.room_num = room_num
        self.counts = 0
        print ('init : ', self.room_num, self.counts)
        
    def incr_counts(self):
        self.counts += 1

    def decr_counts(self):
        self.counts -= 1

    def __hash__(self):
        return hash(self.room_num)

    def __eq__(self, o: object):
        if isinstance(self, o.__class__):
            return self.room_num == o.room_num
        else:
            return NotImplemented
    
    def __ne__(self, o: object):
        if isinstance(self, o.__class__):
            return not self.__eq__(o)
        else:
            return NotImplemented

    def __str__(self) -> str:
        return str({'room_num' : self.room_num, 'counts' : self.counts})

a = Room(1)
print(a, a.__hash__())
b = Room(room_num=1)
print(b, b.__hash__())

c = Room(2)
print(c, c.__hash__())
d = Room(room_num=2)
print(d, d.__hash__())


class Result():
    def __init__(self, success: bool, message: str, value: dict = {}):
        self.__success = success
        self.__message = message
        self.__value = value

    @property
    def success(self):
        return self.__success

    @property
    def message(self):
        return self.__message

    @property
    def value(self):
        return self.__value

    def get_dict(self):
        return {'success': self.__success, 'message': self.__message, 'value': self.__value}
