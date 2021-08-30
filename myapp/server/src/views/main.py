from flask import Blueprint, render_template,  request
from flask.json import jsonify
from ..services.accessed_ip import get_click_counts, put_visits
from .. import TEMPLATE_FORDER_PATH, STATIC_FORDER_PATH
import random
from ..db.redis import redis
from ..services.helper import Result
from ..services.jwt_auth import refresh_token_check

main = Blueprint('main', __name__, url_prefix='/',
                 static_folder=STATIC_FORDER_PATH,
                 template_folder=TEMPLATE_FORDER_PATH)


@main.route('/', defaults={'path': ''})
@main.route('/<path:path>')
def index(path):
    return render_template('index.html')


@main.route('/init', methods=['POST'])
def init():
    put_visits(request.headers.getlist("X-Real-IP")[0])

    try:
        result = refresh_token_check()
    except:
        result = None

    access_token = None
    user_id = None
    nickname = None
    oauth = None

    if result is not None and result.success is False:
        return jsonify(result.get_dict())

    elif result is not None and result.success is True:
        access_token = result.value.get('access_token')
        user_id = result.value.get('user_id')
        nickname = result.value.get('nickname')
        oauth = result.value.get('oauth')

    click_counts = get_click_counts()

    while True:
        visitor_name = 'visitor' + str(random.randrange(1, 100000))
        result = redis.sadd('visitor_names', visitor_name)
        if result == 1:
            break

    return jsonify(Result(True, '', {'click_counts': click_counts, 'access_token': access_token, 'visitor_name': visitor_name, 'user_id': user_id, 'nickname': nickname, 'oauth': oauth}).get_dict())
