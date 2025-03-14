# API - Items Endpoint
This section of the API provides various endpoints to interact with data related to item prices and details. 
Below are the details of each available endpoint:


## Endpoints


### Get Item Prices
- **Endpoint**: `/items/prices/<int:item_id>`
- **Method**: `GET`
- **Description**: Returns item price data for a given `item_id`, filtered by the specified time range.

#### Query Parameters
- `time` (optional): Specifies the time range for filtering the item prices. Possible values are:
  - `1W`: Last 1 week 
  - `1M`: Last 1 month
  - `3M`: Last 3 months
  - `6M`: Last 6 months
  - `1Y`: Last 1 year (default)
  - `5Y`: Last 5 years
  - `ALL`: All available data

#### Example Requests
1. Get prices for `item_id` of `2357` (gold bar) with the default time filter (last 1 week):
`http://localhost:5000/items/prices/2357`

2. Get prices for `item_id` of `2357` (gold bar) with the 3-month filter:
`http://localhost:5000/items/prices/2357?time=3M`

#### Example Responses
```json
[
  [
    2357,
    "2024-03-15",
    2088.0
  ],
  [
    2357,
    "2024-03-15",
    2088.0
  ],
  [
    "...truncated in this example..."
  ]
]
```

### Get All Item IDs
- **Endpoint**: `/items/ids`
- **Method**: `GET`
- **Description**: Retrieves a list of all items from the database and returns a JSON list of `item_id` for use in the frontend.

#### Example Responses
```json
[
  [
    2
  ],
  [
    36
  ],
  [
    "...truncated in this example..."
  ]
]
```

### Get Item Name
- **Endpoint**: `/items/name/<int:item_id>`
- **Method**: `GET`
- **Description**: Returns the item name for a given `item_id`.

#### Example Responses
```json
[
  [
    "Cannonball"
  ]
]
```

### Get Item Description
- **Endpoint**: `/items/description/<int:item_id>`
- **Method**: `GET`
- **Description**: Returns the item description for a given `item_id`.

#### Example Responses
```json
[
  [
    "Ammo for the Dwarf Cannon."
  ]
]
```


### Search for Item
- **Endpoint**: `/items/search/<string:keyword>`
- **Method**: `GET`
- **Description**: Performs a search based on keyword(s) and returns a list of relevant items with their `item_id`, `name`, and `description`.

#### Example Responses
```json
[
  [
    444,
    "Gold ore",
    "This needs refining."
  ],
  [
    1635,
    "Gold ring",
    "A valuable ring."
  ],
  [
    "...truncated in this example..."
  ]
]
```


### Get Number of Items Tracked
- **Endpoint**: `/items/total_count`
- **Method**: `GET`
- **Description**: Returns the total number of items currently tracked in the database.

#### Example Responses
```json
[
  [
    6841
  ]
]
```


### Calculate Profit
- **Endpoint**: `/items/profit`
- **Method**: `POST`
- **Description**: Calculates the profit for an item based on its **purchase date** and/or **purchase price**.  
If the `purchase_price` is not provided, the API will find the closest historical price for the given date.  
Returns the **current price**, **profit if sold now**, and a placeholder for future predicted profit.
#### Example Requests
**1. Calculate profit using a manually entered purchase price:**
```json
{
    "item_id": 2,
    "purchase_date": "2024-04-01",
    "purchase_price": 75000
}
```
**Calculate profit using historical price (no manual price input):**
```json
{
    "item_id": 2,
    "purchase_date": "2024-04-01"
}
```
#### Example Responses
**Successful Response**
```json
{
    "current_price": 78000,
    "profit_now": 3000,
    "predicted_future_price": null,
    "profit_future": null
}
```