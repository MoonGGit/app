from src import create_app, init
from gevent import monkey
monkey.patch_all(thread=False)

init()

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)