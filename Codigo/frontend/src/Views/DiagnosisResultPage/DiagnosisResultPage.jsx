import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./DiagnosisResultPage.css";


const handleFeedback = (type) => {
  Swal.fire({
    title: "Gracias por tu opinión",
    text: type === "positive" ? "¡Nos alegra saberlo!" : "Trabajaremos para mejorar.",
    icon: type === "positive" ? "success" : "info",
  });
};

const Diagnosis = () => {
  const location = useLocation();
  const { top3, diagnosisData, diagnosisSessionId } = location.state; // Retrieve session ID from state

  const navigate = useNavigate();

  const [diseaseData, setDiseaseData] = useState([]);
  const diagnosisDataRef = useRef(diagnosisData);

  // Flag to prevent duplicate POST requests
  const hasPosted = useRef(false);

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
          title: "Advertencia de baja probabilidad",
          text: "Su diagnóstico tiene una probabilidad baja, considere consultar a un profesional de la salud.",
          icon: "warning",
          confirmButtonText: "Understood",
          confirmButtonColor: "#3085d6",
        });
      }

      // Ensure single POST request with diagnosis data
      if (!hasPosted.current) {
        // Set flag just before posting
        hasPosted.current = true;
        try {
          await axios.post(
            "http://localhost:3001/api/diagnosis/create",
            {
              diagnosisSessionId,
              diagnosisIds: diseases.map((disease) => disease.id_disease),
              top3: top3,
              diagnosisData: diagnosisDataRef.current,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
        } catch (error) {
          if (error.response && error.response.status === 409) {
            console.warn("El Diagnóstico ya fue registrado para esta sesión.");
          } else {
            console.error("Error saving diagnosis data:", error);
          }
        }
      }
    };

    if (top3.length > 0) {
      fetchAllDiseases();
    }
  }, [top3, diagnosisSessionId]);

  const handleBackClick = () => {
    navigate("/form");
  };

  return (
    <div>
      <div className="portada">
        <h1>Tus Resultados</h1>
      </div>
      <div className="titulo-diagnosis-result">
      <h1>Los síntomas ingresados indican:</h1>
      </div>
      <div className="diagnosis-container-resultado">
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
          <p>Cargando información sobre enfermedades...</p>
        )}
      </div>
      <div style={{ marginTop: "30px" }}>
        <button onClick={handleBackClick} className="back-button">
          Volver al Formulario
        </button>
        <button className="back-button">Descargar PDF</button >

        <div className="next-steps">
          <h2>¿Qué hacer después?</h2>
          <p>Recomendamos:</p>
          <ul>
            <li>Contactar a un médico para evaluación presencial.</li>
            <li>
              Descargar los resultados en PDF para llevarlos a tu próxima consulta.
            </li>
            <li>Compartir este diagnóstico con un profesional.</li>
          </ul>
        </div>
      </div>
      <div className="feedback-section">
        <h2>¿Cómo calificarías este diagnóstico?</h2>
        <button 
          className="feedback-positive" 
          onClick={() => handleFeedback("positive")}
        >
          👍 Bueno
        </button>
        <button 
          className="feedback-negative" 
          onClick={() => handleFeedback("negative")}
        >
          👎 Necesita Mejoras
        </button>
      </div>

    </div>
    
  );
};

export default Diagnosis;
