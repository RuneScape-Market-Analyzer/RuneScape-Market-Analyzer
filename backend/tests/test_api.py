import sys
import os
import pytest
from flask import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from backend.utils.scripts.init_flask import init_flask

TEST_DB_PATH = ":memory:"
app = init_flask(TEST_DB_PATH)

@pytest.fixture(autouse=True)
def setup_teardown():
    """Set up test database and tear down after each test"""
    with app.app_context():
        # Initialize test database schema
        app.db.create_all()
        yield
        app.db.session.remove()
        app.db.drop_all()

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_home_page(client):
    """Test basic server status endpoint"""
    response = client.get('/')
    assert response.status_code == 200
    assert b"Flask server is running!" in response.data

def test_item_search_success(client, mocker):
    """Test successful item search"""
    # Mock database response
    mock_item = Mock()
    mock_item.serialize.return_value = {"id": 4151, "name": "Abyssal Whip"}
    mocker.patch(
        'backend.utils.endpoints.item_search.Item.search_by_name',
        return_value=[mock_item]
    )
    
    response = client.get('/api/item/search?name=Abyssal%20Whip')
    data = json.loads(response.data)
    
    assert response.status_code == 200
    assert isinstance(data, list)
    assert data[0]['id'] == 4151

def test_item_search_no_results(client, mocker):
    """Test item search with no matches"""
    mocker.patch(
        'backend.utils.endpoints.item_search.Item.search_by_name',
        return_value=[]
    )
    
    response = client.get('/api/item/search?name=InvalidItem123')
    assert response.status_code == 404

def test_item_price_success(client, mocker):
    """Test successful price lookup"""
    # Mock external API call
    mocker.patch(
        'backend.utils.endpoints.item_prices.fetch_live_price',
        return_value=2500000
    )
    
    response = client.get('/api/item/price/4151')
    data = json.loads(response.data)
    
    assert response.status_code == 200
    assert data["price"] == 2500000
    assert "timestamp" in data

def test_item_price_not_found(client, mocker):
    """Test price lookup for invalid item ID"""
    mocker.patch(
        'backend.utils.endpoints.item_prices.fetch_live_price',
        side_effect=ValueError("Invalid item ID")
    )
    
    response = client.get('/api/item/price/99999')
    assert response.status_code == 404