import requests
import json

# Define the URL of your endpoint
url = 'http://localhost:5000/predict'

# Create the test input data
test_input = [False, False, True, False, False, False, False, False, False, False] * 13 + [False]  # This gives you 131 boolean values

# Define the request payload
payload = {
    "input": test_input
}

# Send the request
response = requests.post(url, json=payload)

# Print the response from the server
print(response.json())
