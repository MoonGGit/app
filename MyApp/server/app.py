from flask import Flask, render_template

app = Flask(__name__, static_folder='../client/dist/static',
            template_folder='../client/dist')


def before_request():
    app.jinja_env.cache = {}


app.before_request(before_request)


def test():
    from src.database import engine, SessionLocal
    from src.models import Image_Path, Base, User
    from datetime import datetime
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()

    u1 = User('1', '1', datetime.now(), '1')
    u2 = User('2', '2', datetime.now(), '2')
    session.add_all([u1, u2])
    session.commit()

    a1 = Image_Path('1', 'testpath1')
    a2 = Image_Path('1', 'testpath2')
    a3 = Image_Path('1', 'testpath3')
    a4 = Image_Path('1', 'testpath4')
    b1 = Image_Path('2', 'testpath1')
    b2 = Image_Path('2', 'testpath2')
    b3 = Image_Path('2', 'testpath3')
    b4 = Image_Path('2', 'testpath4')

    session.add_all([a1, a2, a3, a4, b1, b2, b3, b4])
    session.commit()
    session.close()


@ app.route('/')
def hello():
    test()
    return 'good'


if __name__ == "__main__":
    app.run()
