from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3

from backend.utils.scripts.update_item_prices import update_new_item


def create_app(DB_FILE_PATH):
    app = Flask(__name__)
    CORS(app)

    # Helper function to query sqlite database and return result
    def query_db(query, args=(), one=False):
        connection = sqlite3.connect(DB_FILE_PATH)
        cursor = connection.cursor()
        try:
            cursor.execute(query, args)
            result = cursor.fetchall()

            data = (result[0] if result else None) if one else result
            return jsonify(data)
        finally:
            cursor.close()
            connection.close()

    # Homepage to show flask server is running, try visiting: http://127.0.0.1:5000/
    @app.route('/')
    def home_page():
        return 'Flask server is running!'

    # Test Flask Server endpoint from the example db
    @app.route('/users', methods=['GET'])
    def get_users():
        query = 'SELECT * FROM users'
        return query_db(query)

    # Get item prices
    @app.route('/items/prices/<int:item_id>', methods=['GET'])
    def get_item_prices(item_id):
        query = "SELECT * FROM item_prices WHERE item_id = ? ORDER BY date"
        result = query_db(query, (item_id,))

        # if item does not exist in database, fetch updated price of it
        if not result.json:
            update_new_item(DB_FILE_PATH, item_id)
            result = query_db(query, (item_id,))

        return result
    
    # Retrieves a list of item IDs from database
    # Returns JSON list of IDs for use in frontend
    @app.route('/items/ids', methods=['GET'])
    def get_available_items():
        query = "SELECT DISTINCT item_id FROM item_prices ORDER BY item_id"
        return query_db(query)

    return app
