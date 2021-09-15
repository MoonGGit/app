from flask import Flask, render_template
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os
from .db.database import engine
from .db.models import Base
# from .services.accessed_ip import put_click_counts

# PATH
TEMPLATE_FORDER_PATH = '/app/client/dist/'
STATIC_FORDER_PATH = '/app/client/dist/static/'
LOCAL_SAVE_DATA_PATH = '/var/myapp/'


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

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def index(path):
        return render_template('index.html')

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