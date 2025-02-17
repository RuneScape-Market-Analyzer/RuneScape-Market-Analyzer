import sqlite3
import requests


ITEM_DETAILS_ENDPOINT = "https://services.runescape.com/m=itemdb_rs/api/catalogue/detail.json?item={}"

def get_item_details(item_id):
    response = requests.get(ITEM_DETAILS_ENDPOINT.format(item_id))
    if response.status_code != 200:
        print(f"Failed to get details for item {item_id}")
        return None

    data = response.json().get("item", {})
    if not data:
        return None

    return (
        data["id"],
        data["icon"],
        data["icon_large"],
        data["type"],
        data["typeIcon"],
        data["name"],
        data["description"],
        data["members"]
    )

def insert_item_details(DB_FILE_PATH, item_details):
    if not item_details:
        return

    conn = sqlite3.connect(DB_FILE_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT OR REPLACE INTO item_details (item_id, icon, icon_large, type, typeIcon, name, description, members)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, item_details)

    conn.commit()
    conn.close()
    print(f"Stored details for item {item_details[5]} (ID: {item_details[0]})")

def update_item_details(DB_FILE_PATH, item_id):
    item_details = get_item_details(item_id)
    insert_item_details(DB_FILE_PATH, item_details)