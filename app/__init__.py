from flask import Flask
from config import Config
from .models import db
from .routes import register_routes


def create_app():
    app = Flask(__name__, template_folder="../templates", static_folder="../static")
    app.config.from_object(Config)

    db.init_app(app)

    with app.app_context():
        db.create_all()

    # Register routes
    register_routes(app)

    return app
