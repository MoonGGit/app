from flask import Flask
from .database import engine
from .models import Base
from flask_socketio import SocketIO, emit

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
    # app.config['SECRET_KEY'] = 'secret'
    #

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


def create_socket_io():
    """ Create Socket IO """
    socket_io = SocketIO()

    @socket_io.on('click', namespace='/room_click')
    def click():
        emit('someone_clicked', ('', 200), broadcast=True)

    return socket_io
