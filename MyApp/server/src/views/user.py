import os
from flask import Blueprint, json, request, jsonify
from ..services.user import delete_user, update_user, create_user, login_user, set_refresh_token, delete_refresh_token
from ..services.helper import Result
from ..services.jwt_auth import token_check
from .. import TEMPLATE_FORDER_PATH, STATIC_FORDER_PATH
from flask_jwt_extended import create_access_token, create_refresh_token, unset_jwt_cookies, set_refresh_cookies
import requests
from oauth2client import client
from ..services.user_other import create_user_other, login_user_other, set_user_other_refresh_token, delete_user_other_refresh_token, delete_user_other

# todo: escape 적용
user = Blueprint('user', __name__, url_prefix='/user/',
                 static_folder=STATIC_FORDER_PATH,
                 template_folder=TEMPLATE_FORDER_PATH,
                 )


# 계정 생성
@user.route('/new', methods=['POST'])
def new():
    if request.json.get('oauth') is not None and request.json.get('authorizationCode') is not None:
        oauth = request.json['oauth']
        authorization_code = request.json['authorizationCode']

        if oauth == 'GOOGLE':
            CLIENT_SECRET_FILE = os.path.abspath(
                'src/views/auth/client_secret.json')
            credentials = client.credentials_from_clientsecrets_and_code(
                CLIENT_SECRET_FILE, ['https://www.googleapis.com/auth/drive.appdata', 'profile', 'email'], authorization_code)

            # from googleapiclient import discovery
            # import httplib2
            # http_auth = credentials.authorize(httplib2.Http())
            # drive_service = discovery.build('drive', 'v3', http=http_auth)
            # appfolder = drive_service.files().get(fileId='appfolder').execute()

            """ 
            print(credentials.id_token.keys(), flush=True)
            dict_keys(['iss', 'azp', 'aud', 'sub', 'email', 'email_verified', 'at_hash', 'name', 'picture', 'given_name', 'family_name', 'locale', 'iat', 'exp'])
             """
            user_id = credentials.id_token['sub']
            nickname = credentials.id_token['name']
            ip = request.headers.getlist("X-Real-IP")[0]
            result = create_user_other(user_id, oauth, nickname, ip)

            return jsonify(result.get_dict())

    recaptcha_data = {
        'secret': os.environ['RECAPTCHA_SECRET_KEY'],
        'response': request.json['reCaptcha']
    }
    recaptcha_post_url = 'https://www.google.com/recaptcha/api/siteverify'
    recaptcha_response = requests.post(
        recaptcha_post_url, recaptcha_data).json()

    if recaptcha_response['success'] == False:
        return jsonify(Result(False, 'Fail to verifying RECAPTCHA, Retry RECAPTCHA').get_dict())

    user_id = request.json['userID']
    password = request.json['password']
    nickname = request.json['nickname']
    ip = request.headers.getlist("X-Real-IP")[0]
    result = create_user(user_id, password, nickname, ip)

    return jsonify(result.get_dict())


# 로그인
@user.route('/', methods=['POST'])
def login():
    # user
    if request.json.get('oauth') is not None and request.json.get('authorizationCode') is not None:
        oauth = request.json['oauth']
        authorization_code = request.json['authorizationCode']

        if oauth == 'GOOGLE':
            CLIENT_SECRET_FILE = os.path.abspath(
                'src/views/auth/client_secret.json')
            credentials = client.credentials_from_clientsecrets_and_code(
                CLIENT_SECRET_FILE, ['https://www.googleapis.com/auth/drive.appdata', 'profile', 'email'], authorization_code)

            user_id = credentials.id_token['sub']
            login_user_result = login_user_other(user_id, oauth)

    # user_other
    else:
        user_id = request.json['userID']
        password = request.json['password']
        oauth = None
        login_user_result = login_user(user_id, password)

    # 토큰 공통 처리
    if login_user_result.success == True:
        ip = request.headers.getlist("X-Real-IP")[0]
        access_token = create_access_token(
            identity=login_user_result.value.get('user_id'), additional_claims={'oauth': oauth})
        refresh_token = create_refresh_token(
            identity='', additional_claims={'refresh_token_ip': ip, 'oauth': oauth})

        # refresh 저장 - user_other
        if request.json.get('oauth') is not None and request.json.get('authorizationCode') is not None:
            set_refresh_token_result = set_user_other_refresh_token(
                login_user_result.value.get('user_id'), oauth, refresh_token)

        # refresh 저장 - user
        else:
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
def logout(user_id, oauth, access_token):
    if oauth is None:
        delete_refresh_token(user_id)

    else:
        delete_user_other_refresh_token(user_id, oauth)

    response = jsonify(Result(True, 'GoodBye').get_dict())
    unset_jwt_cookies(response)

    return response


# 계정 정보 변경 - todo : 수정
@user.route('/board', methods=['PATCH'])
@token_check
def id_update(user_id, oauth, access_token):
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
def id_delete(user_id, oauth, access_token):
    if user_id is request.json['userID']:

        if oauth is None:
            result = delete_user(user_id)

        else:
            result = delete_user_other(user_id, oauth)

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
