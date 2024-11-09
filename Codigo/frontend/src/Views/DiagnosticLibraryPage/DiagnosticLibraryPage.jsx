import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DiagnosticLibraryPage.css";

const DiagnosticLibraryPage = () => {
  const [diseases, setDiseases] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/disease/diseases"
        );
        setDiseases(response.data);
      } catch (error) {
        setError("Failed to load diseases");
        console.error("Error fetching diseases:", error);
      }
    };
    fetchDiseases();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="diagnostic-library-container">
      <section className="library-main-content">
        <div className="library-text">
          <h1>Biblioteca De Diagnósticos</h1>
          <a href="#table-section" className="library-button">
            Ver
          </a>
        </div>
        <img
          src="/images/diagnostic-list.png"
          alt="Illustration of a diagnostic library"
          className="library-image"
        />
      </section>

      <section id="table-section-library" className="table-section">
        <h2 className="table-title-library">Diagnósticos</h2>
        {diseases.map((disease) => (
          <div key={disease.id_disease} className="disease-card-library">
            <h2>{disease.nombre}</h2>
            <p>{disease.descripcion}</p>
            <ul>
              {disease.precaucion_1 && <li>{disease.precaucion_1}</li>}
              {disease.precaucion_2 && <li>{disease.precaucion_2}</li>}
              {disease.precaucion_3 && <li>{disease.precaucion_3}</li>}
              {disease.precaucion_4 && <li>{disease.precaucion_4}</li>}
              {disease.precaucion_5 && <li>{disease.precaucion_5}</li>}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
};

export default DiagnosticLibraryPage;
