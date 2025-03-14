from flask import Blueprint, jsonify
from backend.utils.endpoints.helper_functions import query_db

item_search_bp = Blueprint('item_search_bp', __name__)


# search function based on keyword, returns list of [item_id, name, description] for relevant results
@item_search_bp.route('/items/search/<string:keyword>', methods=['GET'])
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
