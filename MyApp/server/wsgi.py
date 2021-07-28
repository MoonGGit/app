from src import create_app, init

init()

app = create_app()

if __name__ == "__main__":
    app.run()
