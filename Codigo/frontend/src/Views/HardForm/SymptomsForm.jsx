import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Import UUID
import Select from "react-select"; // Import React Select
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

  // Add a new ComboBox
  const addNewComboBox = () => {
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

  // Handle diagnosis submission
  const handleDiagnosis = async () => {
    // Create an array of 131 booleans, all set to false
    const booleanArray = new Array(131).fill(false);

    // Set the appropriate index to true based on selected symptoms
    Object.values(selectedSymptoms).forEach((modelOrder) => {
      if (modelOrder !== null && modelOrder <= 131) {
        booleanArray[modelOrder] = true;
      }
    });
    console.log(booleanArray);
    console.log(symptoms);
    try {
      const response = await axios.post("http://localhost:5000/predict_proba", {
        input: booleanArray,
      });
      setDiagnosisResult(response.data);
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
          {comboBoxes.map((comboBox) => (
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

              {/* Trash button to remove ComboBox */}
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
