import requests

BASE_URL = "http://localhost:5000"


# Test the /items/ids endpoint to ensure it returns a list of item IDs with the correct data structure
def test_get_all_item_ids():
    response = requests.get(f"{BASE_URL}/items/ids")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    for item_id in data:
        assert isinstance(item_id, list)
        assert isinstance(item_id[0], int)


# Test the /items/name/<int:item_id> endpoint to ensure it returns the name of the item as a nested list of strings
def test_get_item_name():
    item_id = 2  # Example item ID
    response = requests.get(f"{BASE_URL}/items/name/{item_id}")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert isinstance(data[0], list)
    assert isinstance(data[0][0], str)


# Test invalid item ID for /items/name/<int:item_id> to ensure proper error handling
def test_invalid_item_name():
    invalid_item_id = "abc"  # Invalid item ID
    response = requests.get(f"{BASE_URL}/items/name/{invalid_item_id}")
    assert response.status_code == 400 or response.status_code == 404  # Expecting client or resource error


# Test the /items/description/<int:item_id> endpoint to ensure it returns the description of the item as a nested list of strings
def test_get_item_description():
    item_id = 2  # Example item ID
    response = requests.get(f"{BASE_URL}/items/description/{item_id}")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert isinstance(data[0], list)
    assert isinstance(data[0][0], str)


# Test the /items/image_big/<int:item_id> endpoint to ensure it returns a valid URL for the big item image
def test_get_item_image_big():
    item_id = 2  # Example item ID
    response = requests.get(f"{BASE_URL}/items/image_big/{item_id}")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert isinstance(data[0], str)
    assert data[0].startswith("https://")


# Test the /items/image_small/<int:item_id> endpoint to ensure it returns a valid URL for the small item image
def test_get_item_image_small():
    item_id = 2  # Example item ID
    response = requests.get(f"{BASE_URL}/items/image_small/{item_id}")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert isinstance(data[0], str)
    assert data[0].startswith("https://")


# Test the /items/prices/<int:item_id> endpoint to ensure it returns a list of price data, with correct types for item_id, date, and price
def test_get_item_prices():
    item_id = 2357  # Example item ID
    response = requests.get(f"{BASE_URL}/items/prices/{item_id}?time=1W")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    for price_entry in data:
        assert isinstance(price_entry, list)
        assert isinstance(price_entry[0], int)
        assert isinstance(price_entry[1], str)
        assert isinstance(price_entry[2], float)


# Test the /items/prices/top-gainers endpoint to ensure it returns a list of items with correct structure and data types
def test_get_item_top_gainers():
    response = requests.get(f"{BASE_URL}/items/prices/top-gainers")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    for item in data:
        assert isinstance(item, list)
        assert isinstance(item[0], int)
        assert isinstance(item[1], str)
        assert isinstance(item[2], (int, float))
        assert isinstance(item[3], float)


# Test the /items/prices/top-decliners endpoint to ensure it returns a list of items with correct structure and data types
def test_get_item_top_decliners():
    response = requests.get(f"{BASE_URL}/items/prices/top-decliners")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    for item in data:
        assert isinstance(item, list)
        assert isinstance(item[0], int)
        assert isinstance(item[1], str)
        assert isinstance(item[2], (int, float))
        assert isinstance(item[3], float)


# Test the /items/prices/greatest_volume endpoint to ensure it returns a list of items with correct structure and data types
def test_get_item_greatest_volume():
    response = requests.get(f"{BASE_URL}/items/prices/greatest_volume")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    for item in data:
        assert isinstance(item, list)
        assert isinstance(item[0], int)
        assert isinstance(item[1], str)
        assert isinstance(item[2], (int, float))
        assert isinstance(item[3], int)


# Test invalid time parameter for the /items/prices/<int:item_id> endpoint
def test_invalid_time_param():
    item_id = 2357  # Example item ID
    response = requests.get(f"{BASE_URL}/items/prices/{item_id}?time=2Z")
    assert response.status_code == 400  # Expecting a bad request error


# Test the /items/total_count endpoint to ensure it returns the total count of tracked items as a list containing an integer
def test_get_number_of_items_tracked():
    response = requests.get(f"{BASE_URL}/items/total_count")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert isinstance(data[0], list)
    assert isinstance(data[0][0], int)


# Test concurrent requests to /items/prices/top-gainers to ensure the server handles multiple clients
def test_concurrent_requests():
    import threading

    def make_request():
        response = requests.get(f"{BASE_URL}/items/prices/top-gainers")
        assert response.status_code == 200

    threads = []
    for _ in range(10):  # Simulate 10 concurrent requests
        thread = threading.Thread(target=make_request)
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()


if __name__ == "__main__":
    test_get_all_item_ids()
    test_get_item_name()
    test_invalid_item_name()
    test_get_item_description()
    test_get_item_image_big()
    test_get_item_image_small()
    test_get_item_prices()
    test_get_item_top_gainers()
    test_get_item_top_decliners()
    test_get_item_greatest_volume()
    test_invalid_time_param()
    test_get_number_of_items_tracked()
    test_concurrent_requests()
    print("All tests completed successfully!")
