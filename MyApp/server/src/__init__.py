""" Application Factory """
from flask import Flask


def create_app():
    app = Flask(__name__, static_folder='../../client/dist/static')

    # config
    def before_request():
        app.jinja_env.cache = {}
    app.before_request(before_request)

    # blueprint
    from .views.main import main
    app.register_blueprint(main)

    return app
