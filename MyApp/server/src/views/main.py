from flask import Blueprint, render_template, jsonify, request, session
from ..services.accessed_ip import put_click_counts, get_click_counts, put_visits
from .. import TEMPLATE_FORDER_PATH, STATIC_FORDER_PATH


main = Blueprint('main', __name__, url_prefix='/',
                 static_folder=STATIC_FORDER_PATH,
                 template_folder=TEMPLATE_FORDER_PATH)


@main.route('/', defaults={'path': ''})
@main.route('/<path:path>')
def index(path):
    ip = request.headers.getlist("X-Real-IP")[0]
    put_visits(ip)

    return render_template('index.html')


@main.route('/init', methods=['GET'])
def init():
    click_counts = get_click_counts()
    # visitorName = 'CLICK' + str(random.randrange(1, 100000))
    for k, v in session.items():
        print(k, '////', v, flush=True)

    # redis 중복체크 ! 저장 !
    userID = session.get('userID')

    return jsonify({'click_counts': click_counts, 'userID': userID})
    # , 'visitorName': visitorName


""" 
클릭ID 랜덤생성, redis저장 , 반환, 클라 : 클릭ID저장
클라 : 클릭시 클릭ID와 함께 전송, 서버 : 클릭ID와 함께 broadcast, 클라 : 반환된 클릭Id가 동일 시 + 안함
 """

# 동시요청으로 세션관리가 안됨
# @main.route('/click', methods=['PUT'])
# def click():
#     ip = request.headers.getlist("X-Real-IP")[0]
#     put_click_counts(ip)

#     return ('', 204)  # No Content
