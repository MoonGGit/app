from flask import Flask
from .database import engine
from .models import Base

# PATH
TEMPLATE_FORDER_PATH = '/app/client/dist/'
STATIC_FORDER_PATH = '/app/client/dist/static'


def init():
    """ Init Application """
    Base.metadata.create_all(engine)


def create_app():
    """ Application Factory """
    app = Flask(__name__, static_folder=STATIC_FORDER_PATH,
                template_folder=TEMPLATE_FORDER_PATH)

    ##############################
    #           config           #
    ##############################
    def before_request():
        app.jinja_env.cache = {}
    app.before_request(before_request)

    ##############################
    #          blueprint         #
    ##############################
    # main
    from .views.main import main
    app.register_blueprint(main)

    # dots_converter
    from .views.dots_converter import dots_converter
    app.register_blueprint(dots_converter)

    return app
