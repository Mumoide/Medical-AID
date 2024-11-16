import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import API_BASE_URL from "../../apiConfig";  // Import the dynamic base URL
import "./DiagnosticLibraryPage.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const DiagnosticLibraryPage = () => {
  const [diseases, setDiseases] = useState([]);
  const [error, setError] = useState(null);
  const [showDots, setShowDots] = useState(true);

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/disease/diseases`);
        setDiseases(response.data);
      } catch (error) {
        setError("Failed to load diseases");
        console.error("Error fetching diseases:", error);
      }
    };
    fetchDiseases();

    // Listener para verificar el ancho de la pantalla y actualizar `showDots`
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setShowDots(false);
      } else {
        setShowDots(true);
      }
    };

    // Ejecutar la función una vez al cargar el componente
    handleResize();

    // Añadir un event listener para cambios en el tamaño de la ventana
    window.addEventListener("resize", handleResize);

    // Limpiar el listener cuando se desmonta el componente
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  // Configuración del carrusel
  const settings = {
    dots: showDots, // Mostrar u ocultar los dots según el estado
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    dotsClass: "slick-dots custom-dots", // Clase personalizada para los dots
    customPaging: (i) => (
      <div
        style={{
          width: "20px",
          color: "#333",
          border: "1px #333 solid",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "5px",
        }}
      >
        {i + 1}
      </div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false, // Aquí también se fuerza a ocultar los dots en pantallas pequeñas
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="diagnostic-library-container">
      <section>
        <div className="library-main-content">
          <div className="library-text">
            <h1>Biblioteca <br />De Diagnósticos</h1>
            <a href="#table-section-library" className="library-button">
              Ver
            </a>
          </div>
          <img
            src="/images/diagnostic-list.png"
            alt="Illustration of a diagnostic library"
            className="library-image"
          />
        </div>
      </section>

      <section id="table-section-library" className="table-section-library">
        <div className="table-section-background">
          <div className="table-title-library">
            <h2>Diagnósticos</h2>
          </div>

          <Slider {...settings}>
            {diseases.map((disease) => (
              <div key={disease.id_disease} className="disease-card-library">
                <div className="disease-text-content">
                  <h2 className="disease-title-library">{disease.nombre}</h2>
                  <p className="disease-description-library">
                    {disease.descripcion}
                  </p>
                  <ul className="precautions-list-library">
                    <h1>Recomendaciones</h1>
                    {disease.precaucion_1 && <li>{disease.precaucion_1}</li>}
                    {disease.precaucion_2 && <li>{disease.precaucion_2}</li>}
                    {disease.precaucion_3 && <li>{disease.precaucion_3}</li>}
                    {disease.precaucion_4 && <li>{disease.precaucion_4}</li>}
                    {disease.precaucion_5 && <li>{disease.precaucion_5}</li>}
                  </ul>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </div>
  );
};

export default DiagnosticLibraryPage;
