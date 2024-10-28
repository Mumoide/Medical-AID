import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import "./DiagnosisResultPage.css"; // Import the CSS file

const Diagnosis = () => {
  const location = useLocation();
  const { top3 } = location.state || [];

  const navigate = useNavigate(); // Initialize useNavigate hook

  // State to store the disease data for the top 3 diagnoses
  const [diseaseData, setDiseaseData] = useState([]);

  // Function to fetch disease data for each diagnosis
  const fetchDiseaseData = async (modelOrder) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/disease/${modelOrder}`
      );
      return response.data; // Return the disease data
    } catch (error) {
      console.error("Error fetching disease data:", error);
      return null;
    }
  };

  // Fetch data for each diagnosis in top3
  useEffect(() => {
    const fetchAllDiseases = async () => {
      const diseases = await Promise.all(
        top3.map(async (diagnosis) => {
          const disease = await fetchDiseaseData(diagnosis.index); // Fetch disease by index (model_order)
          return {
            ...disease, // Add fetched disease details
            probability: diagnosis.probability, // Keep the probability from the top3
          };
        })
      );
      setDiseaseData(diseases); // Update state with all fetched disease data
    };

    if (top3.length > 0) {
      fetchAllDiseases(); // Only fetch if there are diagnoses in the top3
    }
  }, [top3]);

  // Back button click handler to navigate back to /form
  const handleBackClick = () => {
    navigate("/form");
  };

  return (
    <div>
      <h1>Diagnosis Results</h1>
      <div className="diagnosis-container">
        {diseaseData.length > 0 ? (
          diseaseData.map((disease, index) => (
            <div key={index} className="diagnosis-card">
              <div className="diagnosis-title-container">
                <span className="diagnosis-title">{disease.nombre}</span>
                <span className="probability">
                  ({disease.probability.toFixed(1)}%)
                </span>
              </div>

              <div className="diagnosis-description-container">
                <p>{disease.descripcion}</p>
              </div>

              <div className="diagnosis-recommendations-container">
                <strong>Recomendaciones:</strong>
                <ul>
                  {disease.precaucion_1 && <li>{disease.precaucion_1}</li>}
                  {disease.precaucion_2 && <li>{disease.precaucion_2}</li>}
                  {disease.precaucion_3 && <li>{disease.precaucion_3}</li>}
                  {disease.precaucion_4 && <li>{disease.precaucion_4}</li>}
                  {disease.precaucion_5 && <li>{disease.precaucion_5}</li>}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p>Loading disease information...</p>
        )}
      </div>

      <div style={{ marginTop: "30px" }}>
        <button onClick={handleBackClick} className="back-button">
          Volver
        </button>
      </div>
    </div>
  );
};

export default Diagnosis;
