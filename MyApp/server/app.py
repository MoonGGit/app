from flask import Flask, render_template

app = Flask(__name__, template_folder='../client/dist')


def before_request():
    app.jinja_env.cache = {}


app.before_request(before_request)


@app.route('/')
def hello():
    return render_template('index.html')
