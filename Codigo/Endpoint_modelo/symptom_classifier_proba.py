from flask import Flask, request, jsonify
import numpy as np
import pickle

app = Flask(__name__)

# Load the model
with open('best_rf_model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

# Define the predict_proba endpoint
@app.route('/predict_proba', methods=['POST'])
def predict_proba():
    # Get the data from the POST request
    data = request.get_json()

    # Ensure data is provided
    if 'input' not in data:
        return jsonify({'error': 'No input data provided'}), 400

    try:
        # Convert input to the appropriate format (assuming it's a list of features)
        features = np.array(data['input']).reshape(1, -1)
        
        # Log the received input for debugging
        print(f"Received input: {data['input']}")
        print(f"Features shape: {features.shape}")

        # Make a prediction using predict_proba
        probabilities = model.predict_proba(features)

        # Convert probabilities to percentages
        probabilities_percent = (probabilities * 100).tolist()

        # Log the probabilities for debugging
        print(f"Predicted probabilities: {probabilities_percent}")

        # Return the prediction probabilities as a JSON response
        return jsonify({'probabilities': probabilities_percent})
    except Exception as e:
        print(f"Error: {str(e)}")  # Log the error message
        return jsonify({'error': str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
