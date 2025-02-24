from flask import Blueprint, g

from backend.utils.endpoints.helper import query_db
from backend.utils.scripts.fetch_bulk_data import get_item_price_all

item_bp = Blueprint('item_bp', __name__)


# Get item prices
@item_bp.route('/items/prices/<int:item_id>', methods=['GET'])
def get_item_prices(item_id):
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


@item_bp.route('/items/name/<int:item_id>', methods=['GET'])
def get_item_name(item_id):
    query = f'''
        SELECT name
        FROM items
        WHERE item_id = {item_id};
    '''
    return query_db(query)


@item_bp.route('/items/description/<int:item_id>', methods=['GET'])
def get_item_description(item_id):
    query = f'''
        SELECT description
        FROM items
        WHERE item_id = {item_id};
    '''
    return query_db(query)


# search function based on keyword, returns list of item_id and name of relevant items
@item_bp.route('/items/search/<string:keyword>', methods=['GET'])
def get_item_search_results(keyword):
    query = f'''
        SELECT item_id, name, description
        FROM items
        WHERE LOWER(description) LIKE LOWER('%{keyword.lower()}%');
    '''
    return query_db(query)


# search function based on keyword, returns list of item_id and name of relevant items
@item_bp.route('/items/total_count', methods=['GET'])
def get_item_total_count():
    query = '''
        SELECT COUNT(*) AS total_items
        FROM items;
    '''
    return query_db(query)
