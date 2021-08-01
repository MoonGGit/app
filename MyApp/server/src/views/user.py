from flask import Blueprint,  request, session
from ..services.user import delete_user, put_user, post_user, login_user
from .. import TEMPLATE_FORDER_PATH, STATIC_FORDER_PATH
from ..services.helper import Result

# todo: escape 적용
user = Blueprint('user', __name__, url_prefix='/user/',
                 static_folder=STATIC_FORDER_PATH,
                 template_folder=TEMPLATE_FORDER_PATH,
                 )


@user.route('/post', methods=['POST'])
def create():
    if not 'userID' in session:
        userID = request.json['userID']
        password = request.json['password']
        ip = request.headers.getlist("X-Real-IP")[0]
        result = post_user(userID, password, ip)

        return result.getDict()

    else:
        return Result(False, 'Not allowed access').getDict()

# todo : 구현중


@user.route('/put', methods=['PUT'])
def update():
    userID = request.json['userID']

    if 'userID' in session and userID == session['userID']:
        password = request.json['password']
        result = put_user(userID, password)

        return result.getDict()

    else:
        return Result(False, 'Session expired').getDict()


@user.route('/delete', methods=['POST'])
def delete():
    userID = request.json['userID']

    if 'userID' in session and userID == session['userID']:
        result = delete_user(userID)

        if result.success == True:
            session.clear()
            # session.pop('userID', None)

        return result.getDict()

    else:
        return Result(False, 'Session expired').getDict()


@user.route('/login', methods=['POST'])
def login():
    userID = request.json['userID']
    password = request.json['password']
    result = login_user(userID, password)

    if result.success == True:
        session['userID'] = result.value.get('userID')

    return result.getDict()


@user.route('/logout', methods=['GET'])
def logout():
    session.clear()
    # session.pop('userID', None)

    return Result(True, 'GoodBye').getDict()
