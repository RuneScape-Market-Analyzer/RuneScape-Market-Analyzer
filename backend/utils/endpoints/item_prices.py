from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import pickle
import requests
import xgboost as xgb
from backend.utils.scripts.fetch_bulk_data import get_item_price_all, BULK_ITEM_PRICE_ENDPOINT

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


@item_prices_bp.route('/items/prices/predict/<int:item_id>', methods=['GET'])
def get_predicted_price(item_id):
    try:
        def get_recent_prices(item_id, n_prices):
            response = requests.get(BULK_ITEM_PRICE_ENDPOINT.format(item_id))
            if response.status_code != 200:
                return None
            
            data = response.json()
            prices = []
            for record in sorted(data.get(str(item_id), []), key=lambda x: x['timestamp'], reverse=True)[:n_prices]:
                prices.append(float(record['price']))
            return prices[::-1]

        def load_item_cluster_map():
            cluster_map_path = 'backend/machine-learning/item_cluster_map.csv'
            return pd.read_csv(cluster_map_path)

        def get_model_for_cluster(cluster_num):
            model_path = f'backend/machine-learning/models/model_cluster_{cluster_num}.pkl'
            with open(model_path, 'rb') as f:
                return pickle.load(f)

        cluster_map = load_item_cluster_map()
        item_cluster = cluster_map[cluster_map['item_id'] == item_id]['cluster'].iloc[0]
        
        model = get_model_for_cluster(item_cluster)
        
        recent_10 = get_recent_prices(item_id, 10)
        recent_50 = get_recent_prices(item_id, 50)
        
        if not recent_10 or not recent_50 or len(recent_10) < 10 or len(recent_50) < 50:
            return jsonify({"error": "Insufficient price history"}), 400
            
        mean_price = np.mean(recent_50)
        std_price = np.std(recent_50)
        
        X = np.array([(p - mean_price) / std_price for p in recent_10]).reshape(1, -1)
        dmatrix = xgb.DMatrix(X)
        predicted_z = model.predict(dmatrix)[0]
        predicted_price = (predicted_z * std_price) + mean_price
        
        return jsonify({
            "item_id": item_id,
            "cluster": int(item_cluster),
            "current_price": recent_10[-1],
            "predicted_price": float(predicted_price),
            "predicted_change": float(predicted_price - recent_10[-1]),
            "predicted_change_percent": float(((predicted_price - recent_10[-1]) / recent_10[-1]) * 100)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
