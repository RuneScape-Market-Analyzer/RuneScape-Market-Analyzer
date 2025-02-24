from backend.utils.scripts.init_db_schema import init_db_schema
from backend.utils.scripts.fetch_bulk_data import update_items_table


def init_db(DB_FILE_PATH):
    print("Initializing database schema")
    # defines database schema in case a table is not already defined
    init_db_schema(DB_FILE_PATH)

    print("Updating items table")
    update_items_table(DB_FILE_PATH)
