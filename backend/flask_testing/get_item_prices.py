import sqlite3
import requests  # must install
import datetime
import os

GRAPH_ENDPOINT = "https://services.runescape.com/m=itemdb_rs/api/graph/{}.json"
TEST_IDS = [1337, 21787]


def get_item_price(item_id):
    response = requests.get(GRAPH_ENDPOINT.format(item_id))
    if response.status_code != 200:
        print(f"Failed to get data for item {item_id}")
        return []
    data = response.json()
    prices = data.get("daily", {})
    return [(item_id, datetime.datetime.fromtimestamp(int(date) / 1000).strftime('%Y-%m-%d'), price)
            for date, price in prices.items()]


def store_prices(prices):
    # This will get the current working directory
    current_directory = os.getcwd()

    # Construct the absolute path by joining the current directory with your relative path
    relative_path = '../data/test.db'
    absolute_path = os.path.join(current_directory, relative_path)

    conn = sqlite3.connect(absolute_path)

    c = conn.cursor()
    c.executemany("INSERT INTO item_prices (item_id, date, price) VALUES (?, ?, ?)", prices)
    conn.commit()
    conn.close()
    print(f"Stored {len(prices)} price records.")


def main():
    all_prices = []
    for item_id in TEST_IDS:
        print(f"getting data for item id {item_id}...")
        prices = get_item_price(item_id)
        all_prices.extend(prices)
    if all_prices:
        store_prices(all_prices)


if __name__ == "__main__":
    main()
