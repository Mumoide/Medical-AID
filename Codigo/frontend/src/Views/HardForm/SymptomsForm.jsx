import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { RxCrossCircled } from "react-icons/rx";
import "./SymptomsForm.css";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

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
  const navigate = useNavigate();
  const [normalForm, setNormalForm] = useState(false);
  const [easyForm, setEasyForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  // State for easyForm components
  const [easyComboBoxes, setEasyComboBoxes] = useState([{ id: uuidv4() }]);
  const [selectedEasySymptoms, setSelectedEasySymptoms] = useState({});

  const [shouldScrollToEasy, setShouldScrollToEasy] = useState(false); // Track if scrolling is needed
  const easySectionRef = useRef(null); // Reference for the easy section

  const [shouldScrollToNormal, setShouldScrollToNormal] = useState(false); // Track if scrolling is needed
  const normalSectionRef = useRef(null); // Reference for the easy section

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/symptoms/names"
        );
        const processedSymptoms = response.data.map((symptom) => {
          const categories = symptom.grupo_sintomatico
            .split("/")
            .map((cat) => cat.trim());
          return { ...symptom, categories };
        });
        const sortedSymptoms = processedSymptoms.sort((a, b) =>
          a.nombre.localeCompare(b.nombre)
        );
        setSymptoms(sortedSymptoms);
        setSymptomsLoaded(true);
      } catch (error) {
        console.error("Error al recuperar los nombres de los síntomas:", error);
      }
    };
    fetchSymptoms();
  }, []);

  const handleSymptomChange = (selectedOption, comboBoxId, isEasyForm) => {
    if (isEasyForm) {
      setSelectedEasySymptoms((prevSelectedSymptoms) => ({
        ...prevSelectedSymptoms,
        [comboBoxId]: selectedOption ? selectedOption.model_order : null,
      }));
    } else {
      setSelectedSymptoms((prevSelectedSymptoms) => ({
        ...prevSelectedSymptoms,
        [comboBoxId]: selectedOption ? selectedOption.model_order : null,
      }));
    }
  };

  const getAvailableOptions = (selectedSymptoms) => {
    const selectedModelOrders = new Set(Object.values(selectedSymptoms));

    return symptoms
      .filter((symptom) => !selectedModelOrders.has(symptom.model_order))
      .map((symptom) => ({
        value: symptom.model_order,
        label: formatSymptomName(symptom.nombre),
        model_order: symptom.model_order,
      }));
  };

  const addNewComboBox = () => {
    const latestComboBoxId = comboBoxes[comboBoxes.length - 1].id;
    if (!selectedSymptoms[latestComboBoxId]) {
      alert(
        "Seleccione una opción en el último ComboBox antes de agregar una nueva."
      );
      return;
    }
    if (comboBoxes.length < 16) {
      setComboBoxes([...comboBoxes, { id: uuidv4() }]);
    } else {
      alert("Se alcanzó el máximo de 16 Síntomas");
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

  const addNewEasyComboBox = () => {
    const latestComboBoxId = easyComboBoxes[easyComboBoxes.length - 1].id;
    if (!selectedEasySymptoms[latestComboBoxId]) {
      alert(
        "Seleccione una opción en el último ComboBox antes de agregar una nueva."
      );
      return;
    }
    if (easyComboBoxes.length < 16) {
      setEasyComboBoxes([...easyComboBoxes, { id: uuidv4() }]);
    } else {
      alert("Se alcanzó el máximo de 16 Síntomas");
    }
  };

  const removeEasyComboBox = (comboBoxId) => {
    if (easyComboBoxes.length > 1) {
      setEasyComboBoxes(easyComboBoxes.filter((box) => box.id !== comboBoxId));
      setSelectedEasySymptoms((prevSelectedSymptoms) => {
        const updatedSymptoms = { ...prevSelectedSymptoms };
        delete updatedSymptoms[comboBoxId];
        return updatedSymptoms;
      });
    }
  };

  const getFilteredOptions = (comboBoxId) => {
    return getAvailableOptions(selectedSymptoms);
  };

  const getFilteredOptionsByCategory = (comboBoxId) => {
    // Get available options excluding already selected symptoms
    const availableOptions = symptoms.filter(
      (symptom) =>
        !Object.values(selectedEasySymptoms).includes(symptom.model_order)
    );

    // Apply selectedGroup filtering based on the categories array
    const filteredOptions = selectedGroup
      ? availableOptions.filter((symptom) =>
          symptom.categories.includes(selectedGroup)
        )
      : availableOptions;

    return filteredOptions.map((symptom) => ({
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

    if (selectedIndexes.length === 0) {
      alert(
        "Por favor, selecciona al menos un síntoma antes de iniciar el diagnóstico."
      );
      return;
    }

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
          const token = localStorage.getItem("token");
          const userId = token ? jwtDecode(token)?.id_user : null;
          if (!userId) {
            localStorage.removeItem("token");
          }

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
    }
  };

  const handleEasyDiagnosis = async () => {
    const booleanArray = new Array(131).fill(false);

    // Collect indexes of selected symptoms in easyComboBoxes
    const selectedIndexes = Object.values(selectedEasySymptoms).filter(
      (modelOrder) => modelOrder !== null && modelOrder <= 131
    );

    if (selectedIndexes.length === 0) {
      alert(
        "Por favor, selecciona al menos un síntoma antes de iniciar el diagnóstico."
      );
      return;
    }

    // Set true in booleanArray for selected model orders
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
          const token = localStorage.getItem("token");
          const userId = token ? jwtDecode(token)?.id_user : null;
          if (!userId) {
            localStorage.removeItem("token");
          }

          // Generate a unique diagnosis session ID
          const newDiagnosisSessionId = uuidv4();

          // Request diagnosis prediction from backend
          const response = await axios.post(
            "http://localhost:5000/predict_proba",
            { input: booleanArray }
          );
          const probabilities = response.data.probabilities[0];

          // Filter probabilities > 30% and sort them
          let filteredProbabilities = probabilities
            .map((probability, index) => ({ probability, index }))
            .filter((item) => item.probability > 30)
            .sort((a, b) => b.probability - a.probability);

          // If no probabilities > 30, take the highest probability
          if (filteredProbabilities.length === 0) {
            const maxProbability = Math.max(...probabilities);
            const maxIndex = probabilities.indexOf(maxProbability);
            filteredProbabilities = [
              { probability: maxProbability, index: maxIndex },
            ];
          }

          // Navigate to /diagnosis with relevant data
          navigate("/diagnosis", {
            state: {
              top3: filteredProbabilities,
              diagnosisData: {
                userId,
                timestamp,
                location: { latitude, longitude },
                selectedSymptoms: selectedIndexes,
              },
              diagnosisSessionId: newDiagnosisSessionId,
            },
          });
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    } catch (error) {
      console.error("Error during diagnosis:", error);
    }
  };

  const toggleNormalForm = () => {
    setNormalForm((prevNormalForm) => {
      if (prevNormalForm) {
        return false;
      } else {
        // Reset easyForm-related state
        setEasyForm(false);
        setEasyComboBoxes([{ id: uuidv4() }]);
        setSelectedEasySymptoms({});

        // Set scroll trigger and activate normalForm
        setShouldScrollToNormal(true);
        return true;
      }
    });

    // Reset normalForm-related state
    setComboBoxes([{ id: uuidv4() }]);
    setSelectedSymptoms({});
  };

  const toggleEasyForm = () => {
    setEasyForm((prevEasyForm) => {
      if (prevEasyForm) {
        return false;
      } else {
        // Reset normalForm-related state
        setNormalForm(false);
        setComboBoxes([{ id: uuidv4() }]);
        setSelectedSymptoms({});

        // Set scroll trigger and activate easyForm
        setShouldScrollToEasy(true);
        return true;
      }
    });

    // Reset easyForm-related state
    setEasyComboBoxes([{ id: uuidv4() }]);
    setSelectedEasySymptoms({});
  };

  useEffect(() => {
    if (easyForm && shouldScrollToEasy && easySectionRef.current) {
      // Perform scrolling only if easyForm is active and shouldScrollToEasy is true
      const topPosition =
        easySectionRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: topPosition, behavior: "smooth" });
      setShouldScrollToEasy(false); // Reset the scrolling trigger
    }
  }, [easyForm, shouldScrollToEasy]);

  useEffect(() => {
    if (normalForm && shouldScrollToNormal && normalSectionRef.current) {
      // Perform scrolling only if normalForm is active and shouldScrollToNormal is true
      const topPosition =
        normalSectionRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: topPosition, behavior: "smooth" });
      setShouldScrollToNormal(false); // Reset the scrolling trigger
    }
  }, [normalForm, shouldScrollToNormal]);

  // Extract unique grupo_sintomatico values and sort alphabetically
  const uniqueGroups = [
    ...new Set(symptoms.flatMap((symptom) => symptom.categories)),
  ].sort((a, b) => a.localeCompare(b));

  return (
    <div>
      {!symptomsLoaded ? (
        <div>
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="hero-container-form">
          <div className="introduction">
            <div className="text-content">
              <h1>Diagnósticos Remotos</h1>
              <p className="intro-text">
                Bienvenido a la herramienta de diagnóstico remoto de Medical
                AID. Aquí podrás identificar tus síntomas y recibir orientación
                en unos pocos pasos.
              </p>
              <p>
                ¿No sabes cómo identificar tus síntomas?
                <br />
                Te recomendamos el formulario intuitivo.
              </p>
              <div className="button-container-symptom-form">
                <button className="cta-button-form" onClick={toggleNormalForm}>
                  Formulario
                </button>
                <button className="cta-button-form" onClick={toggleEasyForm}>
                  Formulario Intuitivo
                </button>
              </div>
            </div>
            <div className="diagnostico">
              <img
                src="/images/backgrounds/Diagnostic.png"
                alt="Imagen Principal"
                className="diagnostic-image-form"
              />
            </div>
          </div>
          <section className="seccion-symptoms"></section>

          {normalForm && (
            <div className="easy-section-container" ref={normalSectionRef}>
              <div className="easy-section-instruction-title">
                <h2>Instrucciones</h2>
              </div>
              <div className="seccion-symptoms">
                <div className="seccion-symptomsForm">
                  <img src="/images/icons/seleccion.png" alt="form" />
                  <p>
                    Selecciona los síntomas que describan mejor tu situación
                    actual. Puedes agregar hasta 16 síntomas. Selecciona al
                    menos uno antes de iniciar el diagnóstico.
                  </p>
                </div>
                <div className="seccion-symptomsForm">
                  <img src="/images/icons/rapidez.png" alt="resultados" />
                  <p>
                    Al hacer clic en "Iniciar Diagnóstico," procesaremos tus
                    síntomas para ofrecerte un diagnóstico preliminar. Asegúrate
                    de haber seleccionado todos los síntomas relevantes.
                  </p>
                </div>
                <div className="seccion-symptomsForm">
                  <img src="/images/icons/exploratory.png" alt="form" />
                  <p>
                    Nuestros resultados no reemplazan una consulta médica. Te
                    recomendamos que acudas a un profesional de la salud para
                    una evaluación completa.
                  </p>
                </div>
              </div>
              <div className="diagnosis-container">
                {comboBoxes.map((comboBox, index) => (
                  <div className="combobox-container" key={comboBox.id}>
                    <label htmlFor={`symptom-combobox-${comboBox.id}`}>
                      Selecciona un síntoma:
                    </label>
                    <div className="symptom-combobox">
                      <Select
                        id={`symptom-combobox-${comboBox.id}`}
                        options={getFilteredOptions(comboBox.id)}
                        value={getFilteredOptions(comboBox.id).find(
                          (option) =>
                            option.value === selectedSymptoms[comboBox.id]
                        )}
                        onChange={(selectedOption) =>
                          handleSymptomChange(selectedOption, comboBox.id)
                        }
                        isClearable
                        placeholder="Escribe tu síntoma..."
                        isDisabled={index !== comboBoxes.length - 1}
                        className="seleccionar-sintoma"
                      />
                      {/* {selectedSymptoms[comboBox.id] && (
                  <p>
                    Seleccionaste:{" "}
                    {
                      getFilteredOptions(comboBox.id).find(
                        (option) =>
                          option.value === selectedSymptoms[comboBox.id]
                      )?.label
                    }
                  </p>
                )} */}

                      <button
                        className="eliminar-btn-container"
                        onClick={() => removeComboBox(comboBox.id)}
                        disabled={comboBoxes.length === 1}
                        style={{
                          cursor:
                            comboBoxes.length === 1 ? "not-allowed" : "pointer",
                          opacity: comboBoxes.length === 1 ? 0.5 : 1,
                        }}
                        aria-label="Delete ComboBox"
                      >
                        <RxCrossCircled className="eliminar-btn" />
                      </button>
                    </div>
                  </div>
                ))}
                <div
                  className="buttons-container"
                  style={{ marginTop: "20px" }}
                >
                  <button onClick={addNewComboBox}>Añadir Nuevo</button>

                  <button
                    style={{ padding: "10px 20px", fontSize: "16px" }}
                    onClick={handleDiagnosis}
                  >
                    Iniciar Diagnóstico
                  </button>

                  <button onClick={handleBackClick}>Volver</button>
                </div>
              </div>
            </div>
          )}
          {easyForm && (
            <div className="easy-section-container" ref={easySectionRef}>
              <div className="easy-section-instruction-title">
                <h2>Instrucciones</h2>
              </div>

              <div className="seccion-symptoms">
                <div className="seccion-symptomsForm">
                  <img src="/images/icons/seleccion.png" alt="form" />
                  <p>
                    Selecciona una categoría de síntomas que describa mejor tu
                    situación actual. Puedes agregar hasta 16 síntomas.
                    Selecciona al menos uno antes de iniciar el diagnóstico.
                  </p>
                </div>
                <div className="seccion-symptomsForm">
                  <img src="/images/icons/rapidez.png" alt="resultados" />
                  <p>
                    Al hacer clic en "Iniciar Diagnóstico," procesaremos tus
                    síntomas para ofrecerte un diagnóstico preliminar. Asegúrate
                    de haber seleccionado todos los síntomas relevantes.
                  </p>
                </div>
                <div className="seccion-symptomsForm">
                  <img src="/images/icons/exploratory.png" alt="form" />
                  <p>
                    Nuestros resultados no reemplazan una consulta médica. Te
                    recomendamos que acudas a un profesional de la salud para
                    una evaluación completa.
                  </p>
                </div>
              </div>
              <div className="easy-form-container">
                <div className="categoria">
                  <h2>Selecciona una Categoria</h2>
                  <div className="group-buttons">
                    {uniqueGroups.map((group) => (
                      <button
                        key={group}
                        onClick={() => {
                          setSelectedGroup(group);
                        }}
                        className={`group-button ${
                          selectedGroup === group ? "active" : ""
                        }`}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="combobox-categorias">
                  {easyComboBoxes.map((comboBox, index) => (
                    <div className="combobox-container" key={comboBox.id}>
                      <label htmlFor={`symptom-combobox-${comboBox.id}`}>
                        Selecciona tus síntomas:
                      </label>
                      <div className="symptom-combobox">
                        <Select
                          id={`symptom-combobox-${comboBox.id}`}
                          options={getFilteredOptionsByCategory(comboBox.id)}
                          value={getFilteredOptionsByCategory(comboBox.id).find(
                            (option) =>
                              option.value === selectedEasySymptoms[comboBox.id]
                          )}
                          onChange={(selectedOption) =>
                            handleSymptomChange(
                              selectedOption,
                              comboBox.id,
                              true
                            )
                          }
                          isClearable
                          placeholder="Escribe tu síntoma..."
                          isDisabled={index !== easyComboBoxes.length - 1}
                          className="seleccionar-sintoma"
                        />
                        <button
                          className="eliminar-btn-container"
                          onClick={() => removeEasyComboBox(comboBox.id)}
                          disabled={easyComboBoxes.length === 1}
                          style={{
                            cursor:
                              easyComboBoxes.length === 1
                                ? "not-allowed"
                                : "pointer",
                            opacity: easyComboBoxes.length === 1 ? 0.5 : 1,
                          }}
                          aria-label="Delete ComboBox"
                        >
                          <RxCrossCircled className="eliminar-btn" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div
                    className="buttons-container"
                    style={{ marginTop: "20px" }}
                  >
                    <button onClick={addNewEasyComboBox}>Añadir Nuevo</button>

                    <button
                      style={{ padding: "10px 20px", fontSize: "16px" }}
                      onClick={handleEasyDiagnosis}
                    >
                      Iniciar Diagnóstico
                    </button>

                    <button onClick={handleBackClick}>Volver</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SymptomComboBox;
