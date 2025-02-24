import sqlite3


# Creates table with category id and the number of items that begin with a specific letter in that category
def create_item_category_letters_table(cursor):
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS category_letters (
            category_id INT,
            letter CHAR(1),
            items INT,
            PRIMARY KEY (category_id, letter)
        );
    ''')


# Create item categories table which stores the name of categories and their corresponding category ids
def create_item_category_names_table(cursor):
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS category_names (
            category_id INT PRIMARY KEY,
            category_name VARCHAR(255) UNIQUE
        );
    ''')

    # Create index on category_name since it is expected to be queried a lot in the future
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS index_category_name ON category_names (category_name);
    ''')

    # Insert category data
    category_data = [
        (0, 'Miscellaneous'),
        (1, 'Ammo'),
        (2, 'Arrows'),
        (3, 'Bolts'),
        (4, 'Construction materials'),
        (5, 'Construction products'),
        (6, 'Cooking ingredients'),
        (7, 'Costumes'),
        (8, 'Crafting materials'),
        (9, 'Familiars'),
        (10, 'Farming produce'),
        (11, 'Fletching materials'),
        (12, 'Food and Drink'),
        (13, 'Herblore materials'),
        (14, 'Hunting equipment'),
        (15, 'Hunting Produce'),
        (16, 'Jewellery'),
        (17, 'Mage armour'),
        (18, 'Mage weapons'),
        (19, 'Melee armour - low level'),
        (20, 'Melee armour - mid level'),
        (21, 'Melee armour - high level'),
        (22, 'Melee weapons - low level'),
        (23, 'Melee weapons - mid level'),
        (24, 'Melee weapons - high level'),
        (25, 'Mining and Smithing'),
        (26, 'Potions'),
        (27, 'Prayer armour'),
        (28, 'Prayer materials'),
        (29, 'Range armour'),
        (30, 'Range weapons'),
        (31, 'Runecrafting'),
        (32, 'Runes, Spells and Teleports'),
        (33, 'Seeds'),
        (34, 'Summoning scrolls'),
        (35, 'Tools and containers'),
        (36, 'Woodcutting product'),
        (37, 'Pocket items'),
        (38, 'Stone spirits'),
        (39, 'Salvage'),
        (40, 'Firemaking products'),
        (41, 'Archaeology materials'),
        (42, 'Wood spirits'),
        (43, 'Necromancy armour')
    ]

    cursor.executemany('INSERT OR IGNORE INTO category_names (category_id, category_name) VALUES (?, ?)', category_data)


# Creates item_details tables which contains useful metadata related to an item like its name
def create_item_details_table(cursor):
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS item_details (
            item_id INTEGER PRIMARY KEY,  -- The ItemID of the item, also the primary key
            icon TEXT,                    -- The item sprite image
            icon_large TEXT,              -- The item detail image
            type TEXT,                    -- The item category
            typeIcon TEXT,                -- The item image category
            name TEXT,                    -- The item name
            description TEXT,             -- The item examine
            members BOOLEAN               -- If the item is a member's only item
        );
    ''')


# Creates item_prices table which stores the id and price of an item on a specific date
def create_item_prices_table(cursor):
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS item_prices (
            item_id INT NOT NULL,
            date TEXT NOT NULL,
            price REAL NOT NULL,
            PRIMARY KEY (item_id, date)
        );
    ''')


# Creates items table which stores item data pulled from https://chisel.weirdgloop.org/gazproj/gazbot/rs_dump.json
def create_items_table(cursor):
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS items (
            item_id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            members BOOLEAN,
            high_alchemy INTEGER,
            low_alchemy INTEGER,
            trade_limit INTEGER,
            value INTEGER,
            price INTEGER,
            last INTEGER,
            volume INTEGER
        );
    ''')


def init_db_schema(DB_FILE_PATH):
    connection = sqlite3.connect(DB_FILE_PATH)
    cursor = connection.cursor()

    create_item_category_names_table(cursor)
    create_item_category_letters_table(cursor)
    create_item_details_table(cursor)
    create_item_prices_table(cursor)
    create_items_table(cursor)

    connection.commit()
