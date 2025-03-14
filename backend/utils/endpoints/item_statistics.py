from flask import Blueprint, request, jsonify
from datetime import datetime
from backend.utils.scripts.fetch_bulk_data import get_item_price_all

from backend.utils.endpoints.helper_functions import query_db
item_statistics_bp = Blueprint('item_statistics_bp', __name__)


# returns total number of items currently tracked
@item_statistics_bp.route('/items/total_count', methods=['GET'])
def get_item_total_count():
    query = '''
        SELECT COUNT(*) AS total_items
        FROM items;
    '''
    return query_db(query)


# returns profit based on purchase date and/or price
@item_statistics_bp.route('/items/profit', methods=['POST'])
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
