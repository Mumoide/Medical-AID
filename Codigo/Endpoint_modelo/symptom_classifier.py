import pickle
from flask import Flask, request, jsonify
import numpy as np

app = Flask(__name__)

# Load the model
with open('best_rf_model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

# Define the predict endpoint
@app.route('/predict', methods=['POST'])
def predict():
    # Get the data from the POST request
    data = request.get_json()

    # Ensure data is provided
    if 'input' not in data:
        return jsonify({'error': 'No input data provided'}), 400

    try:
        # Convert input to the appropriate format (assuming it's a list of features)
        features = np.array(data['input']).reshape(1, -1)

        # Make a prediction
        prediction = model.predict(features)

        # Return the prediction as a JSON response
        return jsonify({'prediction': prediction.tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
