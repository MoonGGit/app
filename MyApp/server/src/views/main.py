from flask import Blueprint, render_template, jsonify, request
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


@main.route('/init')
# 마우스 클릭 수 불러오기, 접속ip 업데이트
def init():
    return jsonify({'test': 'data'})


@main.route('/click')
# 마우스 업데이트, 소켓으로 실시간 수정
def click():
    pass
    # return jsonify({'click': 'test'})
