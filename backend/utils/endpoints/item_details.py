import requests
from flask import Blueprint, jsonify
from backend.utils.endpoints.helper_functions import query_db

item_details_bp = Blueprint('item_details_bp', __name__)

ITEM_IMAGE_BIG_ENDPOINT = "https://services.runescape.com/m=itemdb_rs/obj_big.gif?id={}"
ITEM_IMAGE_SMALL_ENDPOINT = "https://services.runescape.com/m=itemdb_rs/obj_sprite.gif?id={}"


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


# returns big item image for requested item_id
@item_details_bp.route('/items/image_big/<int:item_id>', methods=['GET'])
def get_item_image_big(item_id):
    endpoint_url = ITEM_IMAGE_BIG_ENDPOINT.format(item_id)

    try:
        response = requests.get(endpoint_url)
        if response.status_code == 200:
            print(f"Image successfully fetched for ID {item_id}: {endpoint_url}")
            return jsonify([endpoint_url])
        else:
            print(f"Failed to fetch image. HTTP Status Code: {response.status_code}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None


# returns small item sprite for requested item_id
@item_details_bp.route('/items/image_small/<int:item_id>', methods=['GET'])
def get_item_image_small(item_id):
    endpoint_url = ITEM_IMAGE_SMALL_ENDPOINT.format(item_id)

    try:
        response = requests.get(endpoint_url)
        if response.status_code == 200:
            print(f"Image successfully fetched for ID {item_id}: {endpoint_url}")
            return jsonify([endpoint_url])
        else:
            print(f"Failed to fetch image. HTTP Status Code: {response.status_code}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None
