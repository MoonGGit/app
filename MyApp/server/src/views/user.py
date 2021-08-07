from flask import Blueprint, request, jsonify
from ..services.user import delete_user, update_user, create_user, login_user, set_refresh_token, delete_refresh_token
from ..services.helper import Result
from ..services.jwt_auth import token_check
from .. import TEMPLATE_FORDER_PATH, STATIC_FORDER_PATH
from flask_jwt_extended import create_access_token, create_refresh_token, unset_jwt_cookies, set_refresh_cookies

# todo: escape 적용
user = Blueprint('user', __name__, url_prefix='/user/',
                 static_folder=STATIC_FORDER_PATH,
                 template_folder=TEMPLATE_FORDER_PATH,
                 )


# 계정 생성
@user.route('/new', methods=['POST'])
def new():
    userID = request.json['userID']
    password = request.json['password']
    ip = request.headers.getlist("X-Real-IP")[0]
    result = create_user(userID, password, ip)

    return jsonify(result.get_dict())


# 로그인
@user.route('/', methods=['POST'])
def login():
    user_id = request.json['userID']
    password = request.json['password']
    login_user_result = login_user(user_id, password)

    if login_user_result.success == True:
        ip = request.headers.getlist("X-Real-IP")[0]
        access_token = create_access_token(
            identity=login_user_result.value.get('user_id'))
        refresh_token = create_refresh_token(
            identity='', additional_claims={'refresh_token_ip': ip})
        set_refresh_token_result = set_refresh_token(
            login_user_result.value.get('user_id'), refresh_token)

        if set_refresh_token_result.success is True:
            response_dict = login_user_result.get_dict()
            response_dict['value'].update({'access_token': access_token})
            response = jsonify(response_dict)
            set_refresh_cookies(response, refresh_token)

            return response

        else:
            return jsonify(set_refresh_token_result.get_dict())

    else:
        return jsonify(login_user_result.get_dict())


# 로그아웃
@user.route('/board', methods=['DELETE'])
@token_check
def logout(user_id, access_token):
    delete_refresh_token(user_id)
    response = jsonify(Result(True, 'GoodBye').get_dict())
    unset_jwt_cookies(response)

    return response


# 계정 정보 변경
@user.route('/board', methods=['PATCH'])
@token_check
def id_update(user_id, access_token):
    if user_id is request.json['userID']:
        new_password = request.json['newPassword']
        result = update_user(user_id, new_password)

        if result.success is True:
            response = result.get_dict()

            if access_token is not None:
                response['value'].update({'access_token': access_token})

            return jsonify(response)

        else:
            return jsonify(result.get_dict())

    else:
        return jsonify(Result(False, 'Invalide token, Retry Login').get_dict())


# 계정 정보 삭제
@user.route('/board', methods=['POST'])
@token_check
def id_delete(user_id, access_token):
    if user_id is request.json['userID']:
        result = delete_user(user_id)

        if result.success == True:
            response = jsonify(result.get_dict())
            unset_jwt_cookies(response)

            return response

        else:
            return jsonify(result.get_dict())

    else:
        return jsonify(Result(False, 'Invalide token, Retry Login').get_dict())


# 아카이브 표시
@user.route('/archive', methods=['GET'])
def id_archive():
    pass


# 아카이브 내용 추가
@user.route('/archive', methods=['POST'])
def id_archive_add():
    pass


# 아카이브 내용 삭제
@user.route('/archive', methods=['DELETE'])
def id_archive_delete():
    pass
