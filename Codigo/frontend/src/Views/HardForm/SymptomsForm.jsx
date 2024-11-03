import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import "./SymptomsForm.css";

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
  const navigate = useNavigate();

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

  const handleSymptomChange = (selectedOption, comboBoxId) => {
    setSelectedSymptoms((prevSelectedSymptoms) => ({
      ...prevSelectedSymptoms,
      [comboBoxId]: selectedOption ? selectedOption.model_order : null,
    }));
  };

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

  const handleBackClick = () => {
    navigate("/diagnostico");
  };

  const handleDiagnosis = async () => {
    const booleanArray = new Array(131).fill(false);

    // Collect indexes of selected symptoms
    const selectedIndexes = Object.values(selectedSymptoms).filter(
      (modelOrder) => modelOrder !== null && modelOrder <= 131
    );

    selectedIndexes.forEach((modelOrder) => {
      booleanArray[modelOrder] = true;
    });

    try {
      // Obtain the user's geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const timestamp = new Date().toISOString();
          const userId = localStorage.getItem("user_id");

          // Create a new unique diagnosisSessionId directly
          const newDiagnosisSessionId = uuidv4();

          // Sample diagnosis request
          const response = await axios.post(
            "http://localhost:5000/predict_proba",
            { input: booleanArray }
          );
          const probabilities = response.data.probabilities[0];

          // Filter probabilities to include only those greater than 30
          let filteredProbabilities = probabilities
            .map((probability, index) => ({ probability, index }))
            .filter((item) => item.probability > 30)
            .sort((a, b) => b.probability - a.probability);

          // If no probabilities > 30, take the highest probability item
          if (filteredProbabilities.length === 0) {
            const maxProbability = Math.max(...probabilities);
            const maxIndex = probabilities.indexOf(maxProbability);
            filteredProbabilities = [
              { probability: maxProbability, index: maxIndex },
            ];
          }

          // Navigate to /diagnosis with all relevant data, including the new unique diagnosisSessionId
          navigate("/diagnosis", {
            state: {
              top3: filteredProbabilities,
              diagnosisData: {
                userId,
                timestamp,
                location: { latitude, longitude },
                selectedSymptoms: selectedIndexes,
              },
              diagnosisSessionId: newDiagnosisSessionId, // Pass the new session ID
            },
          });
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    } catch (error) {
      console.error("Error during diagnosis:", error);
      setDiagnosisResult("Error during diagnosis");
    }
  };

  return (
    <div style={{ marginTop: "200px", textAlign: "center" }}>
      {!symptomsLoaded ? (
        <div>
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="hero-container">
         
      <div className="text-content">
        <h1>Diagnósticos Remotos</h1>
        <p>¿No sabes cómo identificar tus síntomas?</p>
        <button className="cta-button">Te Ayudamos</button>
      </div>
      <img
        src="/images/backgrounds/img-about.png"
        alt="Imagen Principal"
        className="hero-image"
      />
    
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
                  Selecciona tus síntomas:
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
                  isDisabled={index !== comboBoxes.length - 1}
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
              <h3>Resultados del Diagnóstico:</h3>
              <p>{JSON.stringify(diagnosisResult)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SymptomComboBox;
