from flask_jwt_extended import get_jwt, verify_jwt_in_request, get_jwt_identity, create_access_token, jwt_required
from ..database import session_scope
from ..models import User
from flask import jsonify, request


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

    def getDict(self):
        return {'success': self.__success, 'message': self.__message, 'value': self.__value}


def token_check(f):
    def wrapper(*args, **kwargs):
        # access 토큰 있는 경우
        try:
            verify_jwt_in_request(refresh=False)
            # todo : banned 확인
            return f(user_id=get_jwt_identity(), access_token=None * args, **kwargs)

        # access 토큰 없는 경우, refresh 토큰 체크 후 발급
        except:

            try:
                result = refresh_token_check()
            except:
                return jsonify(Result(False, 'Retry Login').getDict())

            if result.success is False:
                return jsonify(result.getDict())

            elif result.success is True:
                access_token = result.value.get('access_token')
                user_id = result.value.get('user_id')

            return f(user_id=user_id, access_token=access_token, *args, **kwargs)

    wrapper.__name__ = f.__name__
    return wrapper


# GET은 CSRF체크 안함
@jwt_required(refresh=True)
def refresh_token_check():

    refresh_token_raw = request.cookies.get("refresh_token_cookie")
    refresh_token_dict = get_jwt()

    with session_scope() as session:
        try:
            user = session.query(User).filter(
                User.refresh_token == refresh_token_raw).first()

            if(not user is None):
                if(refresh_token_dict['refresh_token_ip'] != user.refresh_token_ip):
                    return Result(False, 'Access ip is different, Retry Login')

                elif(user.banned == True):
                    return Result(False, 'Banned user')

                else:
                    access_token = create_access_token(identity=user.id)
                    return Result(True, 'get access_token', {'access_token': access_token, 'user_id': user.id})

            else:
                return Result(False, 'Not allowed access, Not exist refresh token in Database')

        except Exception:
            return Result(False, 'Database error')
