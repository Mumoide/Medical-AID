import requests

# Define the URL of your endpoint
url = 'http://localhost:5000/predict_proba'

# Create the test input data
test_input = [False, False, True, False, False, False, False, False, False, False] * 13 + [False]  # This gives you 131 boolean values

# Define the request payload
payload = {
    "input": test_input
}

# Send the request
response = requests.post(url, json=payload)

# Print the response from the server
if response.status_code == 200:
    print(response.json())
else:
    print(f"Error: {response.status_code}, Response Text: {response.text}")