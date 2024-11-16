import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./DiseasePage.css";

function DiseasePage() {
  const [disease, setDisease] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const disease_name = location.state?.disease_name;

  useEffect(() => {
    if (disease_name) {
      const fetchDisease = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/api/disease/name/${disease_name}`
          );

          if (!response.ok) {
            if (response.status === 404) {
              Swal.fire("Not Found", "Disease not found", "error");
            } else {
              Swal.fire("Error", "Failed to fetch disease data", "error");
            }
            return;
          }

          const data = await response.json();
          setDisease(data);
        } catch (error) {
          console.error("Error fetching disease:", error);
          Swal.fire(
            "Error",
            "An error occurred while fetching disease data",
            "error"
          );
        }
      };

      fetchDisease();
    }
  }, [disease_name]);

  if (!disease) {
    return <div>Cargando información de enfermedades...</div>;
  }

  return (
    <div className="disease-page">
      <h1>{disease.nombre}</h1>
      <div className="disease-card">
        <p>
          <strong>Descripción:</strong> {disease.descripcion}
        </p>
        <div className="precautions-disease-page">
          <p className="precaution-item-disease-page">
            <strong>Precaución 1:</strong> {disease.precaucion_1}
          </p>
          <p className="precaution-item-disease-page">
            <strong>Precaución 2:</strong> {disease.precaucion_2}
          </p>
          <p className="precaution-item-disease-page">
            <strong>Precaución 3:</strong> {disease.precaucion_3}
          </p>
          <p className="precaution-item-disease-page">
            <strong>Precaución 4:</strong> {disease.precaucion_4}
          </p>
          <p className="precaution-item-disease-page">
            <strong>Precaución 5:</strong> {disease.precaucion_5}
          </p>
        </div>
      </div>
      <button onClick={() => navigate(-1)} className="back-button-disease">
        Volver
      </button>
    </div>
  );
}

export default DiseasePage;
