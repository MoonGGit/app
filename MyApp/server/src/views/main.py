from flask import Blueprint, render_template,  request, session
from ..services.accessed_ip import put_click_counts, get_click_counts, put_visits
from .. import TEMPLATE_FORDER_PATH, STATIC_FORDER_PATH
import random
from ..redis import redis

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

    while True:
        visitorName = 'visitor' + str(random.randrange(1, 100000))
        result = redis.sadd('visitor_names', visitorName)
        if result == 1:
            break

    userID = session.get('userID')

    return {'click_counts': click_counts, 'userID': userID, 'visitorName': visitorName}


# 동시요청으로 세션관리가 안됨
# @main.route('/click', methods=['PUT'])
# def click():
#     ip = request.headers.getlist("X-Real-IP")[0]
#     put_click_counts(ip)

#     return ('', 204)  # No Content
