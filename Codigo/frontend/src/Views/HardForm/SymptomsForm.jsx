import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Import UUID
import Select from "react-select"; // Import React Select
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./SymptomsForm.css";

// Helper function to format the symptom name
const formatSymptomName = (symptomName) => {
  let formattedName = symptomName.replace(/_/g, " ");
  return (
    formattedName.charAt(0).toUpperCase() + formattedName.slice(1).toLowerCase()
  );
};

const SymptomComboBox = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [comboBoxes, setComboBoxes] = useState([{ id: uuidv4() }]);
  const [selectedSymptoms, setSelectedSymptoms] = useState({});
  const [symptomsLoaded, setSymptomsLoaded] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch symptom names from the API
  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/symptoms/names"
        );
        const sortedSymptoms = response.data.sort((a, b) =>
          a.nombre.localeCompare(b.nombre)
        );
        setSymptoms(sortedSymptoms);
        setSymptomsLoaded(true);
      } catch (error) {
        console.error("Error fetching symptom names:", error);
      }
    };
    fetchSymptoms();
  }, []);

  // Handle symptom selection
  const handleSymptomChange = (selectedOption, comboBoxId) => {
    setSelectedSymptoms((prevSelectedSymptoms) => ({
      ...prevSelectedSymptoms,
      [comboBoxId]: selectedOption ? selectedOption.model_order : null,
    }));
  };

  // Add a new ComboBox (only if the last one has a selected option)
  const addNewComboBox = () => {
    const latestComboBoxId = comboBoxes[comboBoxes.length - 1].id;
    if (!selectedSymptoms[latestComboBoxId]) {
      alert(
        "Please select an option in the latest ComboBox before adding a new one."
      );
      return;
    }

    if (comboBoxes.length < 16) {
      setComboBoxes([...comboBoxes, { id: uuidv4() }]);
    } else {
      alert("Maximum of 16 ComboBoxes reached");
    }
  };

  // Remove a ComboBox by its ID
  const removeComboBox = (comboBoxId) => {
    if (comboBoxes.length > 1) {
      setComboBoxes(comboBoxes.filter((box) => box.id !== comboBoxId));
      setSelectedSymptoms((prevSelectedSymptoms) => {
        const updatedSymptoms = { ...prevSelectedSymptoms };
        delete updatedSymptoms[comboBoxId];
        return updatedSymptoms;
      });
    }
  };

  // Prepare options for React Select, filtering out already selected symptoms
  const getFilteredOptions = (comboBoxId) => {
    const selectedModelOrders = Object.values(selectedSymptoms);
    return symptoms
      .filter(
        (symptom) =>
          !selectedModelOrders.includes(symptom.model_order) ||
          selectedSymptoms[comboBoxId] === symptom.model_order
      )
      .map((symptom) => ({
        value: symptom.model_order,
        label: formatSymptomName(symptom.nombre),
        model_order: symptom.model_order,
      }));
  };

  // Back button click handler to navigate back to /form
  const handleBackClick = () => {
    navigate("/diagnostico");
  };

  // Handle diagnosis submission
  const handleDiagnosis = async () => {
    const booleanArray = new Array(131).fill(false);

    Object.values(selectedSymptoms).forEach((modelOrder) => {
      if (modelOrder !== null && modelOrder <= 131) {
        booleanArray[modelOrder] = true;
      }
    });

    try {
      const response = await axios.post("http://localhost:5000/predict_proba", {
        input: booleanArray,
      });
      const probabilities = response.data.probabilities[0];

      // Extract the top 3 highest probabilities and their indexes
      const top3 = probabilities
        .map((probability, index) => ({ probability, index }))
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 3);

      // Redirect to /diagnosis with the top 3 data
      navigate("/diagnosis", { state: { top3 } });
    } catch (error) {
      console.error("Error during diagnosis:", error);
      setDiagnosisResult("Error during diagnosis");
    }
  };

  return (
    <div style={{ marginTop: "200px", textAlign: "center" }}>
      {!symptomsLoaded ? (
        <div>
          <div className="spinner"></div> {/* Spinner with CSS */}
        </div>
      ) : (
        <>
          {comboBoxes.map((comboBox, index) => (
            <div
              key={comboBox.id}
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div>
                <label htmlFor={`symptom-combobox-${comboBox.id}`}>
                  Select a Symptom:
                </label>
                <Select
                  id={`symptom-combobox-${comboBox.id}`}
                  options={getFilteredOptions(comboBox.id)}
                  value={getFilteredOptions(comboBox.id).find(
                    (option) => option.value === selectedSymptoms[comboBox.id]
                  )}
                  onChange={(selectedOption) =>
                    handleSymptomChange(selectedOption, comboBox.id)
                  }
                  isClearable
                  placeholder="Type to search..."
                  isDisabled={index !== comboBoxes.length - 1} // Disable all except the latest ComboBox
                  styles={{
                    container: (base) => ({
                      ...base,
                      width: "300px",
                      margin: "10px auto",
                    }),
                  }}
                />
                {selectedSymptoms[comboBox.id] && (
                  <p>
                    You selected:{" "}
                    {
                      getFilteredOptions(comboBox.id).find(
                        (option) =>
                          option.value === selectedSymptoms[comboBox.id]
                      )?.label
                    }
                  </p>
                )}
              </div>

              <button
                onClick={() => removeComboBox(comboBox.id)}
                disabled={comboBoxes.length === 1}
                style={{
                  marginLeft: "10px",
                  background: "none",
                  border: "none",
                  cursor: comboBoxes.length === 1 ? "not-allowed" : "pointer",
                  fontSize: "20px",
                  opacity: comboBoxes.length === 1 ? 0.5 : 1,
                }}
                aria-label="Delete ComboBox"
              >
                🗑️
              </button>
            </div>
          ))}

          <div style={{ marginTop: "20px" }}>
            <button
              style={{
                marginRight: "10px",
                padding: "10px 20px",
                fontSize: "16px",
              }}
              onClick={addNewComboBox}
            >
              Añadir Nuevo
            </button>
            <button
              style={{ padding: "10px 20px", fontSize: "16px" }}
              onClick={handleDiagnosis}
            >
              Iniciar Diagnóstico
            </button>

            <button onClick={handleBackClick} className="back-button">
              Volver
            </button>
          </div>

          {diagnosisResult && (
            <div style={{ marginTop: "20px" }}>
              <h3>Diagnosis Result:</h3>
              <p>{JSON.stringify(diagnosisResult)}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SymptomComboBox;
