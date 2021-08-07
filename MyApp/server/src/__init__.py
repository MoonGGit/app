from flask import Flask
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os
from .db.database import engine
from .db.models import Base
""" from flask_socketio import SocketIO, emit
from engineio.payload import Payload """
# from .services.accessed_ip import put_click_counts


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
    app.config.update(APPLICATION_ROOT="/",
                      # SECRET_KEY=os.environ['SECRET_KEY']
                      # SESSION_COOKIE_SAMESITE="None",
                      # SESSION_COOKIE_SECURE=False,
                      # SESSION_COOKIE_PATH="/",
                      # PERMANENT_SESSION_LIFETIME=timedelta(minutes=30),

                      # over https. In production, this should always be set to True
                      JWT_COOKIE_SECURE=False,
                      JWT_TOKEN_LOCATION=["cookies", "headers"],
                      JWT_SECRET_KEY=os.environ['JWT_SECRET_KEY'],
                      JWT_ACCESS_TOKEN_EXPIRES=timedelta(minutes=30),
                      JWT_REFRESH_TOKEN_EXPIRES=timedelta(hours=1)
                      )

    JWTManager(app)

    @app.before_request
    def before_request():
        app.jinja_env.cache = {}
        # session.permanent = True

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


""" 
소켓서버로 

def create_socket_io():
    Payload.max_decode_packets = 100
    socket_io = SocketIO()

    @socket_io.on('connect', namespace='/room_click')
    def connect():
        for k, v in request.headers.items():
            print(k, '////', v)
        print('connected', flush=True)

    @socket_io.on('disconnect', namespace='/room_click')
    def disconnect():
        for k, v in request.headers.items():
            print(k, '////', v)
        # todo : 누가 끊겼는지 확인
        print('disconnected', flush=True)

    @socket_io.on('click', namespace='/room_click')
    def click(visitorNameJsonData):
        # 일단 /click 땜빵
        ip = request.headers.getlist("X-Real-IP")[0]
        put_click_counts(ip)
        ###
        emit('someone_clicked', visitorNameJsonData, broadcast=True)

    return socket_io """
