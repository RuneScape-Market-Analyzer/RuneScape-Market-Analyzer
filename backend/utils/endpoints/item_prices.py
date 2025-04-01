from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from backend.utils.scripts.fetch_bulk_data import get_item_price_all

from backend.utils.endpoints.helper_functions import query_db
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


# returns top 5 gainers from previous day to today
@item_prices_bp.route('/items/prices/top-gainers', methods=['GET'])
def get_item_top_gainers():
    query = '''
        SELECT 
            item_id, 
            name, 
            price, 
            percent_change
        FROM 
            items
        ORDER BY 
            percent_change DESC
        LIMIT 5;
    '''
    return query_db(query)


# returns top 5 decliners from previous day to today
@item_prices_bp.route('/items/prices/top-decliners', methods=['GET'])
def get_item_top_decliners():
    query = '''
        SELECT 
            item_id, 
            name, 
            price, 
            percent_change
        FROM 
            items
        ORDER BY 
            percent_change ASC
        LIMIT 5;
    '''
    return query_db(query)


# returns top 5 items today by volume
@item_prices_bp.route('/items/prices/greatest_volume', methods=['GET'])
def get_item_greatest_volume():
    query = '''
        SELECT 
            item_id, 
            name, 
            price, 
            volume
        FROM 
            items
        ORDER BY 
            volume DESC
        LIMIT 5;
    '''
    return query_db(query)
