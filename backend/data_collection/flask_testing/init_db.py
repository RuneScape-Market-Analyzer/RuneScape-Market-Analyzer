import sqlite3

conn = sqlite3.connect('test.db')
c = conn.cursor()

c.execute('''CREATE TABLE IF NOT EXISTS users
             (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)''')

c.execute("INSERT INTO users (name, age) VALUES ('Test1', 20)")
c.execute("INSERT INTO users (name, age) VALUES ('Test2', 50)")

# item prices table
c.execute('''
    CREATE TABLE IF NOT EXISTS item_prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        price INTEGER NOT NULL
    )
''')

conn.commit()