from flask import Blueprint, render_template, jsonify, request
from .. import TEMPLATE_FORDER_PATH, STATIC_FORDER_PATH

dots_converter = Blueprint('dots_converter', __name__, url_prefix='/dots-converter/',
                           static_folder=STATIC_FORDER_PATH,
                           template_folder=TEMPLATE_FORDER_PATH)


@dots_converter.route('/', defaults={'path': ''})
@dots_converter.route('/<path:path>')
def index(path):
    return render_template('index.html')
