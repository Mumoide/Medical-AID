import pytest
import numpy as np
from symptom_classifier_proba import app  # Import the Flask app from your file
from numpy.testing import assert_array_equal  # Import this for array comparison

# Fixture for the Flask test client
@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_predict_proba_success(client, mocker):
    """
    Test successful response from the predict_proba endpoint.
    """
    # Mock data for the request
    input_data = [0.5, 1.2, 3.4]

    # Mock the model's predict_proba method
    mock_predict_proba = mocker.patch("symptom_classifier_proba.model.predict_proba")
    mock_predict_proba.return_value = np.array([[0.7, 0.3]])

    # Send POST request to the endpoint
    response = client.post('/predict_proba', json={'input': input_data})

    # Assertions
    assert response.status_code == 200
    response_json = response.get_json()
    assert 'probabilities' in response_json
    assert response_json['probabilities'] == [[70.0, 30.0]]

    # Extract the actual input passed to the mocked method
    actual_input = mock_predict_proba.call_args[0][0]

    # Verify the model's predict_proba method was called with the correct input
    assert_array_equal(actual_input, np.array(input_data).reshape(1, -1))

def test_predict_proba_no_input(client):
    """
    Test error response when no input data is provided.
    """
    response = client.post('/predict_proba', json={})

    assert response.status_code == 400
    response_json = response.get_json()
    assert response_json == {'error': 'No input data provided'}

def test_predict_proba_exception(client, mocker):
    """
    Test error response when an exception occurs during prediction.
    """
    input_data = [0.5, 1.2, 3.4]

    # Mock the model's predict_proba method to raise an exception
    mock_predict_proba = mocker.patch("symptom_classifier_proba.model.predict_proba")
    mock_predict_proba.side_effect = Exception("Mock prediction error")

    response = client.post('/predict_proba', json={'input': input_data})

    assert response.status_code == 500
    response_json = response.get_json()
    assert 'error' in response_json
    assert response_json['error'] == "Mock prediction error"
