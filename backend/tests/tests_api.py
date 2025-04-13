import sys
import os
import pytest
from flask import json

# Add project root to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from backend.utils.scripts.init_flask import init_flask

TEST_DB_PATH = ":memory:"
app = init_flask(TEST_DB_PATH)

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_home_page(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b"Flask server is running!" in response.data

def test_item_search(client):
    # Test valid search
    response = client.get('/api/item/search?name=Abyssal%20Whip')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list)
    assert "id" in data[0]

def test_item_prices(client, mocker):
    # Mock database calls (example)
    mock_price = mocker.patch('backend.utils.endpoints.item_prices.get_item_price')
    mock_price.return_value = {"price": 2500000}
    
    response = client.get('/api/item/price/4151')  # Abyssal Whip ID
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["price"] == 2500000