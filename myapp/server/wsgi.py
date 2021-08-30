from src import create_app, init
from gevent import monkey
monkey.patch_all(thread=False)

init()

app = create_app()

""" 
소켓 서버로 

socket_io = create_socket_io()
socket_io.init_app(app) """
# socket_io.init_app(app, cors_allowed_origins="*")


if __name__ == "__main__":
    app.run(debug=True)
