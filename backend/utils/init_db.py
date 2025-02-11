from backend.utils.scripts.safety_checks import create_db
from backend.utils.scripts.update_item_prices import update_existing_items


def update_db(DB_FILE_PATH):
    print("Starting database update sequence...")

    # creates database if it doesn't exist
    create_db(DB_FILE_PATH)
    print("Finished checking database integrity")

    # updates price data in database
    update_existing_items(DB_FILE_PATH)
    print("Updated prices of existing items in database")
