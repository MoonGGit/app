from flask import jsonify, request
from flask_jwt_extended import get_jwt, verify_jwt_in_request, get_jwt_identity, create_access_token, jwt_required
from ..db.database import session_scope
from ..db.models import User, User_Other
from .helper import Result


def token_check(f):
    def wrapper(*args, **kwargs):
        # access 토큰 있는 경우
        try:
            verify_jwt_in_request(refresh=False)
            # todo : banned 확인
            return f(user_id=get_jwt_identity(), oauth=get_jwt()['oauth'], access_token=None, * args, **kwargs)

        # access 토큰 없는 경우, refresh 토큰 체크 후 발급
        except:
            try:
                result = refresh_token_check()
            except:
                return jsonify(Result(False, 'Retry Login').get_dict())

            if result.success is False:
                return jsonify(result.get_dict())

            elif result.success is True:
                access_token = result.value.get('access_token')
                user_id = result.value.get('user_id')
                oauth = result.value.get('oauth')

            return f(user_id=user_id, oauth=oauth, access_token=access_token, *args, **kwargs)

    wrapper.__name__ = f.__name__
    return wrapper


@jwt_required(refresh=True)
def refresh_token_check():

    refresh_token_raw = request.cookies.get("refresh_token_cookie")
    refresh_token_dict = get_jwt()

    with session_scope() as session:
        try:
            if refresh_token_dict['oauth'] is None:
                user = session.query(User).filter(
                    User.refresh_token == refresh_token_raw).first()

            else:
                user = session.query(User_Other).filter(
                    User_Other.refresh_token == refresh_token_raw).first()

            if(not user is None):
                if(refresh_token_dict['refresh_token_ip'] != request.headers.getlist("X-Real-IP")[0]):
                    return Result(False, 'Access ip is different, Retry Login')

                elif(user.banned == True):
                    return Result(False, 'Banned user')

                else:
                    access_token = create_access_token(identity=user.id, additional_claims={
                                                       'oauth': refresh_token_dict['oauth']})
                    return Result(True, 'get access_token', {'access_token': access_token, 'user_id': user.id, 'oauth': refresh_token_dict['oauth'], 'nickname': user.nickname})

            else:
                return Result(False, 'Not allowed access, Not exist refresh token in Database')

        except Exception:
            return Result(False, 'Database error')
