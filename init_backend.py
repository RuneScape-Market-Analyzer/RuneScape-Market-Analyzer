import os
from backend.utils.init_flask import create_app
from backend.utils.init_db import update_db

# global variable for absolute path to the database file
DB_FILE_PATH = os.path.join(os.getcwd(), 'backend/data/prod.db')


def main():
    # Updates the database
    update_db(DB_FILE_PATH)

    # Starts Flask Server
    app = create_app(DB_FILE_PATH)
    app.run(debug=True)


if __name__ == '__main__':
    main()
