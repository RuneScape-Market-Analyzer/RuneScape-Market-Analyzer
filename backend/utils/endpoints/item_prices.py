from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from backend.utils.scripts.fetch_bulk_data import get_item_price_all

item_prices_bp = Blueprint('item_prices_bp', __name__)


# returns all available item price data for an item_id
@item_prices_bp.route('/items/prices/<int:item_id>', methods=['GET'])
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
