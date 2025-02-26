# API - Items Endpoint

This section of the API provides various endpoints to interact with data related to item prices and details. 
Below are the details of each available endpoint:

## Endpoints

### Get Item Prices
- **Endpoint**: `/items/prices/<int:item_id>`
- **Method**: `GET`
- **Description**: Returns all available item price data for a given `item_id`.

### Get All Item IDs
- **Endpoint**: `/items/ids`
- **Method**: `GET`
- **Description**: Retrieves a list of all items from the database and returns a JSON list of `item_id` for use in the frontend.

### Get Item Name
- **Endpoint**: `/items/name/<int:item_id>`
- **Method**: `GET`
- **Description**: Returns the item name for a given `item_id`.

### Get Item Description
- **Endpoint**: `/items/description/<int:item_id>`
- **Method**: `GET`
- **Description**: Returns the item description for a given `item_id`.

### Search for Item
- **Endpoint**: `/items/search/<string:keyword>`
- **Method**: `GET`
- **Description**: Performs a search based on keyword(s) and returns a list of relevant items with their `item_id`, `name`, and `description`.

### Get Number of Items Tracked
- **Endpoint**: `/items/total_count`
- **Method**: `GET`
- **Description**: Returns the total number of items currently tracked in the database.
