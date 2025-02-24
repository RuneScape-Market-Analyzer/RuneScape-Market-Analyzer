import os
from backend.utils.init_flask import init_flask
from backend.utils.init_db import init_db

# global variable for absolute path to the database file
DB_FILE_PATH = os.path.join(os.getcwd(), 'backend/data/prod.db')


def main():
    # Initializes the database
    init_db(DB_FILE_PATH)

    # Starts Flask Server
    flask_server = init_flask(DB_FILE_PATH)
    flask_server.run(debug=True)


if __name__ == '__main__':
    main()
