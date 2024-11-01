import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert
import "./DiagnosisResultPage.css";

const Diagnosis = () => {
  const location = useLocation();
  const { top3, diagnosisData } = location.state;

  const navigate = useNavigate();

  // State to store the disease data for the top 3 diagnoses
  const [diseaseData, setDiseaseData] = useState([]);

  // Use ref for diagnosisData to prevent re-triggering useEffect
  const diagnosisDataRef = useRef(diagnosisData);

  // Function to fetch disease data for each diagnosis
  const fetchDiseaseData = async (modelOrder) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/disease/${modelOrder}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching disease data:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAllDiseases = async () => {
      const diseases = await Promise.all(
        top3.map(async (diagnosis) => {
          const disease = await fetchDiseaseData(diagnosis.index);
          return {
            ...disease,
            probability: diagnosis.probability,
          };
        })
      );
      setDiseaseData(diseases);

      if (top3.some((diagnosis) => diagnosis.probability < 30)) {
        Swal.fire({
          title: "Low Probability Warning",
          text: "Your diagnosis has a low probability, please consider consulting a healthcare professional.",
          icon: "warning",
          confirmButtonText: "Understood",
          confirmButtonColor: "#3085d6",
        });
      }

      // Send data to backend using diagnosisDataRef to avoid re-triggering useEffect
      await axios.post("http://localhost:3001/api/diagnosis/create", {
        diagnosisIds: diseases.map((disease) => disease.id_disease),
        top3: top3,
        diagnosisData: diagnosisDataRef.current, // Use ref here
      });
    };

    if (top3.length > 0) {
      fetchAllDiseases();
    }
  }, [top3]); // Only top3 as a dependency

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
