from flask import Flask, g
from flask_cors import CORS

from backend.utils.scripts.fetch_bulk_data import *
from backend.utils.endpoints.item_prices import item_prices_bp
from backend.utils.endpoints.item_details import item_details_bp
from backend.utils.endpoints.item_search import item_search_bp
from backend.utils.endpoints.item_statistics import item_statistics_bp


def init_flask(DB_FILE_PATH):
    app = Flask(__name__)
    CORS(app)

    # Register blueprints
    app.register_blueprint(item_prices_bp)
    app.register_blueprint(item_details_bp)
    app.register_blueprint(item_search_bp)
    app.register_blueprint(item_statistics_bp)

    @app.before_request
    def before_request():
        g.db_file_path = DB_FILE_PATH

    # Homepage to show flask server is running, try visiting: http://127.0.0.1:5000/
    @app.route('/')
    def home_page():
        return 'Flask server is running!'

    return app
