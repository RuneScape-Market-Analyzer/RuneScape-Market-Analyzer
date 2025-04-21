import sqlite3
import requests
from datetime import datetime

BULK_ITEM_ENDPOINT = "https://chisel.weirdgloop.org/gazproj/gazbot/rs_dump.json"
BULK_ITEM_PRICE_ENDPOINT = "https://api.weirdgloop.org/exchange/history/rs/all?id={}"


def update_items_table(DB_FILE_PATH):
    connection = sqlite3.connect(DB_FILE_PATH)
    cursor = connection.cursor()

    response = requests.get(BULK_ITEM_ENDPOINT)
    if response.status_code != 200:
        print(f"Failed to get data for list of items")
        return []

    data = response.json()

    # Insert data into the table
    for item in data.values():
        try:
            cursor.execute('''
                INSERT OR REPLACE INTO items (
                    item_id, name, description, members, high_alchemy, low_alchemy, trade_limit, value, price, last, volume
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                int(item['id']), item['name'], item.get('examine', None), item.get('members', None), item.get('highalch', None),
                item.get('lowalch', None), item.get('limit', None), item.get('value', None), item.get('price', None),
                item.get('last', None), item.get('volume', None)
            ))

        # results contains an update line at the end, looks like the following, will throw error:
        # "%UPDATE_DETECTED%": 1740386632.002803, "%JAGEX_TIMESTAMP%": 1740386172}
        except TypeError as e:
            print(f"\nError Message: {e}")
            print(f"Error line: {item}\n")

    connection.commit()


def timestamp_to_date(timestamp):
    return datetime.utcfromtimestamp(timestamp / 1000).strftime('%Y-%m-%d')


def get_item_price_all(item_id):
    response = requests.get(BULK_ITEM_PRICE_ENDPOINT.format(item_id))
    if response.status_code != 200:
        print(f"Failed to get data for item {item_id}")
        return []

    data = response.json()

    return_data = []
    for item_id, records in data.items():
        for record in records:
            date = timestamp_to_date(record['timestamp'])
            price = float(record['price'])
            volume = record.get('volume', None)
            return_data.append([int(item_id), date, price, volume])

    return return_data
