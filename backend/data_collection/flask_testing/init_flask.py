from flask import Flask, jsonify
import sqlite3

app = Flask(__name__)


# Helper function to query sqlite database and return result
def query_db(query, args=(), one=False):
    connection = sqlite3.connect('test.db')
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
@app.route('/prices/<int:item_id>', methods=['GET'])
def get_item_prices(item_id):
    return query_db("SELECT * FROM item_prices WHERE item_id = ? ORDER BY date", (item_id,))

if __name__ == '__main__':
    app.run(debug=True)
