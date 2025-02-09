"""
Config file for use in code related to RuneScape API
"""


"""
List of Endpoints
For more detailed RuneScape API description, see:
https://runescape.wiki/w/Application_programming_interface#Grand_Exchange_Database_API
"""
# Configuration: https://runescape.wiki/w/Application_programming_interface#Configuration
INFO_ENDPOINT = "https://secure.runescape.com/m=itemdb_rs/api/info.json"

# Catalogue: https://runescape.wiki/w/Application_programming_interface#Catalogue
CATEGORY_ENDPOINT = "https://services.runescape.com/m=itemdb_rs/api/catalogue/category.json?"
ITEMS_ENDPOINT = "https://services.runescape.com/m=itemdb_rs/api/catalogue/items.json?"
DETAIL_ENDPOINT = "https://services.runescape.com/m=itemdb_rs/api/catalogue/detail.json?"
IMAGES_DETAILED_ENDPOINT = "https://services.runescape.com/m=itemdb_rs/obj_big.gif?"
IMAGES_INVENTORY_ICON_ENDPOINT = "https://services.runescape.com/m=itemdb_rs/obj_sprite.gif?"

# Graph: https://runescape.wiki/w/Application_programming_interface#Graph
GRAPH_ENDPOINT = "https://services.runescape.com/m=itemdb_rs/api/graph/X.json"  # replace "X" with ItemID

# Skills & Activities: https://runescape.wiki/w/Application_programming_interface#Skills_and_Activities
RANKING_ENDPOINT = "https://secure.runescape.com/m=hiscore/ranking.json?"
USER_RANKING_ENDPOINT = "https://secure.runescape.com/c=0/m=hiscore/userRanking.json"  # replace 0 in c=0
HISCORE_LITE_ENDPOINT = "https://secure.runescape.com/m=hiscore/index_lite.ws?"
IRONMAN_LITE_ENDPOINT = "https://secure.runescape.com/m=hiscore_ironman/index_lite.ws?"
HARDCORE_IRONMAN_ENDPOINT = "https://secure.runescape.com/m=hiscore_hardcore_ironman/index_lite.ws?"

# Seasonal: https://runescape.wiki/w/Application_programming_interface#Seasonal
GET_RANKINGS_ENDPOINT = "http://services.runescape.com/m=temp-hiscores/getRankings.json?"  # archive exists
GET_HISCORE_DETAILS_ENDPOINT = "http://services.runescape.com/m=temp-hiscores/getHiscoreDetails.json"  # archive exists

# Clans: https://runescape.wiki/w/Application_programming_interface#Clans
CLAN_RANKING_ENDPOINT = "http://services.runescape.com/m=clan-hiscores/clanRanking.json"
USER_CLAN_RANKING_ENDPOINT = "http://services.runescape.com/c=0/m=clan-hiscores/userClanRanking.json"
CLAN_MEMBERS_LITE_ENDPOINT = "http://services.runescape.com/m=clan-hiscores/members_lite.ws?"


"""
Settings that might be needed in future
Placeholder Section
"""
# REQUEST_TIMEOUT = 10  # Timeout for API requests in seconds
# RETRY_LIMIT = 3       # Number of times to retry failed requests
