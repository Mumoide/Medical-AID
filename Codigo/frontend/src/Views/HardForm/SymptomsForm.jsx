import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Import UUID
import Select from "react-select"; // Import React Select
import "./SymptomsForm.css";

// Helper function to format the symptom name
const formatSymptomName = (symptomName) => {
  // Replace underscores with spaces and capitalize only the first word
  let formattedName = symptomName.replace(/_/g, " ");
  return (
    formattedName.charAt(0).toUpperCase() + formattedName.slice(1).toLowerCase()
  );
};

const SymptomComboBox = () => {
  // State to store symptom names
  const [symptoms, setSymptoms] = useState([]);
  const [comboBoxes, setComboBoxes] = useState([{ id: uuidv4() }]); // Use UUID for unique ComboBox IDs
  const [selectedSymptoms, setSelectedSymptoms] = useState({});
  const [symptomsLoaded, setSymptomsLoaded] = useState(false); // Track if symptoms are loaded

  // Fetch symptom names from the API
  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/symptoms/names"
        );

        // Sort symptoms alphabetically before setting state
        const sortedSymptoms = response.data.sort((a, b) =>
          a.nombre.localeCompare(b.nombre)
        );
        console.log(response.data);

        setSymptoms(sortedSymptoms); // Store the sorted symptom names in state
        setSymptomsLoaded(true); // Set loaded to true once symptoms are fetched
      } catch (error) {
        console.error("Error fetching symptom names:", error);
      }
    };

    fetchSymptoms(); // Call the function to fetch symptoms when the component mounts
  }, []);

  // Handler for when a symptom is selected from a specific ComboBox
  const handleSymptomChange = (selectedOption, comboBoxId) => {
    setSelectedSymptoms({
      ...selectedSymptoms,
      [comboBoxId]: selectedOption ? selectedOption.value : "",
    });
  };

  // Function to add a new ComboBox, limit to a maximum of 16 ComboBoxes
  const addNewComboBox = () => {
    if (comboBoxes.length < 16) {
      setComboBoxes([...comboBoxes, { id: uuidv4() }]); // Add a new ComboBox with a unique UUID
    } else {
      alert("Maximum of 16 ComboBoxes reached");
    }
  };

  // Function to remove a ComboBox by its ID (only if there are 2 or more ComboBoxes)
  const removeComboBox = (comboBoxId) => {
    if (comboBoxes.length > 1) {
      setComboBoxes(comboBoxes.filter((box) => box.id !== comboBoxId)); // Remove the ComboBox by its ID
      const updatedSelectedSymptoms = { ...selectedSymptoms };
      delete updatedSelectedSymptoms[comboBoxId]; // Remove the corresponding selected symptom
      setSelectedSymptoms(updatedSelectedSymptoms);
    }
  };

  // Convert symptoms to format for React Select
  const symptomOptions = symptoms.map((symptom) => ({
    value: formatSymptomName(symptom.nombre),
    label: formatSymptomName(symptom.nombre),
  }));

  return (
    <div style={{ marginTop: "200px", textAlign: "center" }}>
      {/* Display loading spinner or message while loading */}
      {!symptomsLoaded ? (
        <div>
          <div className="spinner"></div> {/* Spinner with CSS */}
        </div>
      ) : (
        // Display ComboBoxes once symptoms are loaded
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
                  options={symptomOptions}
                  value={symptomOptions.find(
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
                      width: "300px", // Adjust width as needed
                      margin: "10px auto",
                    }),
                  }}
                />
                {selectedSymptoms[comboBox.id] && (
                  <p>You selected: {selectedSymptoms[comboBox.id]}</p>
                )}
              </div>

              {/* Trash button to remove ComboBox, disabled if only 1 ComboBox */}
              <button
                onClick={() => removeComboBox(comboBox.id)}
                disabled={comboBoxes.length === 1} // Disable if there's only one ComboBox
                style={{
                  marginLeft: "10px",
                  background: "none",
                  border: "none",
                  cursor: comboBoxes.length === 1 ? "not-allowed" : "pointer",
                  fontSize: "20px",
                  opacity: comboBoxes.length === 1 ? 0.5 : 1, // Add visual feedback when disabled
                }}
                aria-label="Delete ComboBox"
              >
                🗑️ {/* Trash icon */}
              </button>
            </div>
          ))}

          {/* Add buttons below the ComboBox */}
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
              onClick={() => alert("Iniciar Diagnóstico clicked")}
            >
              Iniciar Diagnóstico
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SymptomComboBox;
