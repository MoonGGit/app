from flask import Flask, session, request
from .database import engine
from .models import Base
from flask_socketio import SocketIO, emit
from engineio.payload import Payload
import os
from datetime import timedelta
from .services.accessed_ip import put_click_counts


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
    app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)
    app.config.update(APPLICATION_ROOT="/",
                      SESSION_COOKIE_SAMESITE="None",
                      SESSION_COOKIE_SECURE=True,
                      SESSION_COOKIE_PATH="/")

    @app.before_request
    def before_request():
        app.jinja_env.cache = {}
        session.permanent = True

    ##############################
    #          blueprint         #
    ##############################
    # main
    from .views.main import main
    app.register_blueprint(main)

    # dots_converter
    from .views.dots_converter import dots_converter
    app.register_blueprint(dots_converter)

    # user
    from .views.user import user
    app.register_blueprint(user)

    return app


def create_socket_io():
    """ Create Socket IO """
    Payload.max_decode_packets = 100
    socket_io = SocketIO(async_mode='gevent')

    @socket_io.on('connect', namespace='/room_click')
    def connect():
        print('connected', flush=True)

    @socket_io.on('disconnect', namespace='/room_click')
    def disconnect():
        print('disconnected', flush=True)

    @socket_io.on('click', namespace='/room_click')
    def click():
        # 일단 /click 땜빵
        ip = request.headers.getlist("X-Real-IP")[0]
        put_click_counts(ip)
        ###
        print('clicked', flush=True)
        emit('someone_clicked', ('test', 200), broadcast=True)

    return socket_io
