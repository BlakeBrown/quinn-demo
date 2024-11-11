from hikerapi import Client

# Initialize the HikerAPI client with your API token
client = Client(token="jgofgmdj82l8bmdn98nlf8otr23sfqd7")

# Replace 'blakelockbrown' with your Instagram username
username = "blakelockbrown"
print("fetching user info")
# Fetch user information
user_info = client.user_by_username_v1(username)
print(user_info)
# Extract the user ID
user_id = user_info["pk"]
print(user_id)