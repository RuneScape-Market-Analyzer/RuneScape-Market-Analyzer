from flask import Blueprint, jsonify
from backend.utils.endpoints.helper_functions import query_db

item_details_bp = Blueprint('item_details_bp', __name__)


# retrieves a list of item IDs from database, returns JSON list of IDs for use in frontend
@item_details_bp.route('/items/ids', methods=['GET'])
def get_all_ids():
    query = '''
        SELECT item_id
        FROM items
        ORDER BY item_id ASC;
    '''
    return query_db(query)


# returns item name for an item_id
@item_details_bp.route('/items/name/<int:item_id>', methods=['GET'])
def get_item_name(item_id):
    query = f'''
        SELECT name
        FROM items
        WHERE item_id = {item_id};
    '''
    return query_db(query)


# returns item description for an item_id
@item_details_bp.route('/items/description/<int:item_id>', methods=['GET'])
def get_item_description(item_id):
    query = f'''
        SELECT description
        FROM items
        WHERE item_id = {item_id};
    '''
    return query_db(query)
