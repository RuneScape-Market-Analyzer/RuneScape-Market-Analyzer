from flask import Flask, g
from flask_cors import CORS

from backend.utils.scripts.fetch_bulk_data import *
from backend.utils.endpoints.items_endpoint import item_bp


def init_flask(DB_FILE_PATH):
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(item_bp)

    @app.before_request
    def before_request():
        g.db_file_path = DB_FILE_PATH

    # Homepage to show flask server is running, try visiting: http://127.0.0.1:5000/
    @app.route('/')
    def home_page():
        return 'Flask server is running!'

    return app
