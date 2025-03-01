from flask import Blueprint, request, jsonify, g
from datetime import datetime, timedelta

from backend.utils.endpoints.helper import query_db
from backend.utils.scripts.fetch_bulk_data import get_item_price_all

item_bp = Blueprint('item_bp', __name__)


# returns all available item price data for an item_id
@item_bp.route('/items/prices/<int:item_id>', methods=['GET'])
def get_item_prices(item_id):
    time_filter = request.args.get('time', '1Y').upper()
    all_prices = get_item_price_all(item_id)

    # Function to filter prices based on date
    def filter_prices(prices, start):
        return [price for price in prices if datetime.strptime(price[1], "%Y-%m-%d") >= start]

    # Calculate the start date based on the time filter
    end_date = datetime.now()
    if time_filter == '1W':
        start_date = end_date - timedelta(weeks=1)
    elif time_filter == '1M':
        start_date = end_date - timedelta(days=30)
    elif time_filter == '3M':
        start_date = end_date - timedelta(days=90)
    elif time_filter == '6M':
        start_date = end_date - timedelta(days=180)
    elif time_filter == '1Y':
        start_date = end_date - timedelta(days=365)
    elif time_filter == '5Y':
        start_date = end_date - timedelta(days=5 * 365)
    elif time_filter == 'ALL':
        return jsonify(all_prices)
    else:
        return jsonify({"error": "Invalid time filter"}), 400

    filtered_prices = filter_prices(all_prices, start_date)
    return jsonify(filtered_prices)

    return get_item_price_all(item_id)


# Retrieves a list of item IDs from database
# Returns JSON list of IDs for use in frontend
@item_bp.route('/items/ids', methods=['GET'])
def get_all_ids():
    query = '''
        SELECT item_id
        FROM items
        ORDER BY item_id ASC;
    '''
    return query_db(query)


# returns item name for an item_id
@item_bp.route('/items/name/<int:item_id>', methods=['GET'])
def get_item_name(item_id):
    query = f'''
        SELECT name
        FROM items
        WHERE item_id = {item_id};
    '''
    return query_db(query)


# returns item description for an item_id
@item_bp.route('/items/description/<int:item_id>', methods=['GET'])
def get_item_description(item_id):
    query = f'''
        SELECT description
        FROM items
        WHERE item_id = {item_id};
    '''
    return query_db(query)


# search function based on keyword, returns list of [item_id, name, description] for relevant results
@item_bp.route('/items/search/<string:keyword>', methods=['GET'])
def get_item_search_results(keyword):
    query = f'''
        SELECT item_id, name, description
        FROM items
        WHERE LOWER(name) LIKE LOWER('%{keyword.lower()}%')
        OR LOWER(description) LIKE LOWER('%{keyword.lower()}%')
        ORDER BY CASE
            WHEN LOWER(name) LIKE LOWER('%{keyword.lower()}%') THEN 1
            ELSE 2
        END, item_id, name, description;
    '''
    return query_db(query)


# returns total number of items currently tracked
@item_bp.route('/items/total_count', methods=['GET'])
def get_item_total_count():
    query = '''
        SELECT COUNT(*) AS total_items
        FROM items;
    '''
    return query_db(query)

# returns profit based on purchase date and/or price
@item_bp.route('/items/profit', methods=['POST'])
def calculate_profit():
    data = request.get_json()
    item_id = data.get("item_id")
    purchase_date = data.get("purchase_date")
    purchase_price = data.get("purchase_price")  # Optional field

    if not item_id or not purchase_date:
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        purchase_date = datetime.strptime(purchase_date, "%Y-%m-%d")
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    all_prices = get_item_price_all(item_id)

    if not all_prices:
        return jsonify({"error": "No price data found for this item"}), 404

    # If purchase price isn't provided, find the closest price based on purchase date
    if not purchase_price:
        closest_price = None
        for entry in all_prices:
            _, date_str, price = entry  # Extract date and price, ignore item_id
            date_obj = datetime.strptime(date_str, "%Y-%m-%d")
            if date_obj <= purchase_date:
                closest_price = price
            else:
                break
        if closest_price is None:
            return jsonify({"error": "No historical price found for this item at the given date"}), 404
        purchase_price = closest_price

    # Get current price (latest entry)
    _, latest_date, current_price = all_prices[-1]

    # TODO: Replace with ML model prediction when available
    predicted_future_price = None

    # Calculate profits
    profit_now = (current_price - purchase_price) if current_price is not None else None
    profit_future = (predicted_future_price - purchase_price) if predicted_future_price is not None else None

    return jsonify({
        "current_price": current_price,
        "profit_now": profit_now,
        "predicted_future_price": predicted_future_price,
        "profit_future": profit_future
    })