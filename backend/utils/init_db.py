from backend.utils.scripts.init_db_schema import init_db_schema
from backend.utils.scripts.update_item_prices import update_existing_items


def update_db(DB_FILE_PATH):
    print("Starting database update sequence...")

    # creates database if it doesn't exist
    init_db_schema(DB_FILE_PATH)
    print("Finished checking database integrity")

    # updates price data in database, disabled temporarily due to RuneScape API rate limiting
    # update_existing_items(DB_FILE_PATH)
    # print("Updated prices of existing items in database")
