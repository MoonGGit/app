class Singleton(type):
    __instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls.__instances:
            cls.__instances[cls] = super().__call__(*args, **kwargs)
        return cls.__instances[cls]

# todo : redis 사용
# class Visitors(metaclass=Singleton):
#     def __init__(self, list:list):
#         self.list = list


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
