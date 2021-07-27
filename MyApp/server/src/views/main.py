from flask import Blueprint, render_template, jsonify

main = Blueprint('main', __name__,
                 url_prefix='/',
                 template_folder='/app/client/dist/',
                 )


@main.route('/')
def index():
    return render_template('index.html')


@main.route('/init')
def init():
    return jsonify({'init': 'test'})


@main.route('/click')
def click():
    return jsonify({'click': 'test'})
