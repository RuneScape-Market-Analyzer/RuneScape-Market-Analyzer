"""
Module with utility functions for safety and sanity checks. Update as needed in the future.
"""

import sqlite3


def create_db(DB_FILE_PATH):
    conn = sqlite3.connect(DB_FILE_PATH)
    c = conn.cursor()

    # item prices table
    c.execute('''
        CREATE TABLE IF NOT EXISTS item_prices (
            item_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            price REAL NOT NULL,
            PRIMARY KEY (item_id, date)
        );
    ''')

    conn.commit()
