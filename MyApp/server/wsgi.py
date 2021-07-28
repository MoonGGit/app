from src import create_app, init, create_socket_io
from gevent import monkey
monkey.patch_all(thread=False)

init()

app = create_app()
socket_io = create_socket_io()
socket_io.init_app(app)
# socket_io.init_app(app, cors_allowed_origins="*")


if __name__ == "__main__":
    socket_io.run(app, debug=True)
