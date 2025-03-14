from flask import g, jsonify
import sqlite3


def query_db(query, args=(), one=False):
    connection = sqlite3.connect(g.db_file_path)
    cursor = connection.cursor()
    try:
        cursor.execute(query, args)
        result = cursor.fetchall()
        data = (result[0] if result else None) if one else result
        return jsonify(data)
    finally:
        cursor.close()
        connection.close()
