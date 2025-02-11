import datetime
import sqlite3
import requests  # must install

GRAPH_ENDPOINT = "https://services.runescape.com/m=itemdb_rs/api/graph/{}.json"
TEST_IDS = [1337, 21787, 2357]  # 2357 is gold ingot


def get_item_price(item_id):
    response = requests.get(GRAPH_ENDPOINT.format(item_id))
    if response.status_code != 200:
        print(f"Failed to get data for item {item_id}")
        return []

    data = response.json()
    prices = data.get("daily", {})
    return_data = [(item_id, datetime.datetime.fromtimestamp(int(date) / 1000).strftime('%Y-%m-%d'), price)
                   for date, price in prices.items()]

    return return_data


def insert_item_prices(DB_FILE_PATH, prices):
    conn = sqlite3.connect(DB_FILE_PATH)

    c = conn.cursor()
    c.executemany("INSERT OR REPLACE INTO item_prices (item_id, date, price) VALUES (?, ?, ?)", prices)
    conn.commit()
    conn.close()
    print(f"Stored {len(prices)} price records.")


# Driver function for inserting the price of a new item not previously in database
def update_new_item(DB_FILE_PATH, item_id):
    print(f"updating new item data for item id {item_id}")
    price = get_item_price(item_id)
    if price:
        insert_item_prices(DB_FILE_PATH, price)


# Driver function for price updates, temporarily uses a list of test_ids for this.
# In the future, function will update all existing item ids in database, which can take a very long time.
# This functionality might be removed in future development.
def update_existing_items(DB_FILE_PATH):
    all_prices = []
    for item_id in TEST_IDS:
        print(f"getting data for item id {item_id}...")
        prices = get_item_price(item_id)
        all_prices.extend(prices)
    if all_prices:
        insert_item_prices(DB_FILE_PATH, all_prices)
