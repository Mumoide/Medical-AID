import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Use react-router-dom's useNavigate hook
import "./RegisterPage.css";
import axios from "axios"; // Import axios
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheck } from "react-icons/fa"; // Import the check icon
import Swal from "sweetalert2";
import TermsAndPolicy from "../../Components/TermsAndPolicy/TermsAndPolicy"; // Import the Terms and Policy component

const RegisterPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [showTerms, setShowTerms] = useState(false);
  // Check if the user is already logged in and redirect if necessary
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // If the user is logged in, redirect to the homepage
      navigate("/");
    }
  }, [navigate]);
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    fechaNacimiento: "",
    genero: "",
    altura: "",
    peso: "",
    telefono: "",
    direccion: "",
    comuna: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleToggleTerms = () => {
    setShowTerms(!showTerms);
  };

  const validateForm = () => {
    const currentDate = new Date();
    const birthDate = new Date(formData.fechaNacimiento);
    const currentYear = new Date().getFullYear();
    const birthYear = new Date(formData.fechaNacimiento).getFullYear();
    const age = currentYear - birthYear;

    const lettersRegex = /^[a-zA-ZÀ-ÿ\s]+$/; // Regex to allow only letters and spaces
    const numbersRegex = /^[0-9]+$/; // Regex to allow only integer numbers
    const decimalNumbersRegex = /^[0-9]+(\.[0-9]+)?$/; // Regex to allow integers or decimals

    if (formData.nombre.length > 30 || !lettersRegex.test(formData.nombre)) {
      toast.error(
        "El nombre no debe tener más de 30 caracteres y solo debe incluir letras."
      );
      return false;
    }

    if (birthDate > currentDate) {
      toast.error("La fecha de nacimiento no puede estar en el futuro.");
      return false;
    }

    if (
      formData.apellidoPaterno.length > 20 ||
      !lettersRegex.test(formData.apellidoPaterno)
    ) {
      toast.error(
        "El apellido paterno no debe tener más de 20 caracteres y solo debe incluir letras."
      );
      return false;
    }

    if (
      formData.apellidoMaterno.length > 20 ||
      !lettersRegex.test(formData.apellidoMaterno)
    ) {
      toast.error(
        "El apellido materno no debe tener más de 20 caracteres y solo debe incluir letras."
      );
      return false;
    }

    if (age > 110) {
      toast.error("La fecha de nacimiento no puede ser mayor de 110 años.");
      return false;
    }

    if (
      formData.genero &&
      !["Masculino", "Femenino", "Prefiero no decirlo"].includes(
        formData.genero
      )
    ) {
      toast.error("Género inválido.");
      return false;
    }

    if (
      formData.altura &&
      (!decimalNumbersRegex.test(formData.altura) ||
        formData.altura < 30 ||
        formData.altura > 220)
    ) {
      toast.error(
        "La altura debe estar entre 30 y 220 cm, y solo debe incluir números."
      );
      return false;
    }

    if (
      formData.peso &&
      (!decimalNumbersRegex.test(formData.peso) ||
        formData.peso < 2 ||
        formData.peso > 300)
    ) {
      toast.error(
        "El peso debe estar entre 2 y 300 kg, y solo debe incluir números."
      );
      return false;
    }

    if (
      formData.telefono.length !== 9 ||
      !numbersRegex.test(formData.telefono)
    ) {
      toast.error(
        "El número de teléfono debe tener 9 dígitos y solo debe incluir números."
      );
      return false;
    }

    if (formData.direccion.length > 50) {
      toast.error("La dirección no debe tener más de 50 caracteres.");
      return false;
    }

    if (formData.comuna.length > 50) {
      toast.error("La comuna no debe tener más de 50 caracteres.");
      return false;
    }

    if (formData.correo.length > 60) {
      toast.error("El correo no debe tener más de 60 caracteres.");
      return false;
    }

    if (
      formData.contrasena.length > 50 ||
      formData.confirmarContrasena.length > 50
    ) {
      toast.error(
        "La contraseña y la confirmación no deben tener más de 50 caracteres."
      );
      return false;
    }

    if (formData.contrasena !== formData.confirmarContrasena) {
      toast.error("Las contraseñas no coinciden.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run validation
    if (!validateForm()) {
      return;
    }

    // Combine Apellido Paterno and Apellido Materno before submission
    const fullApellidos = `${formData.apellidoPaterno} ${formData.apellidoMaterno}`;

    // Prepare the data to be sent to the backend, including profile information
    const finalFormData = {
      email: formData.correo, // Email from the form
      password: formData.contrasena, // Password from the form
      profile: {
        names: formData.nombre,
        last_names: fullApellidos,
        birthdate: formData.fechaNacimiento,
        gender: formData.genero,
        height: formData.altura,
        weight: formData.peso,
        phone_number: formData.telefono,
        address: formData.direccion,
        comune: formData.comuna,
      },
    };

    try {
      // Make a POST request to the backend to register the user and their profile
      const response = await axios.post(
        "http://localhost:3001/api/users/register",
        finalFormData
      );
      console.log("User registered:", response.data);

      // Show success message using react-toastify
      toast.success(
        <div style={{ display: "flex", alignItems: "center", color: "white" }}>
          <span>Bienvenid@! Tu cuenta fue creada con éxito</span>
          <FaCheck
            style={{
              marginLeft: "30px",
              color: "white",
              backgroundColor: "#32b00c",
              borderRadius: "50%",
              padding: "5px",
              fontSize: "24px",
            }}
          />
        </div>,
        {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          icon: false, // Disable the default Toastify icon
          style: {
            backgroundColor: "#3690a4",
            minWidth: "500px",
          },
          onClose: () => navigate("/inicio-de-sesion"), // Redirecciona al cerrar el toast
        }
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data.error || "Error al registrar usuario",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#b00c0c",
      });
      console.error(
        "Error registering user:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="register-page">
      <ToastContainer />
      <div className="register-container">
        {/* Sección de la Imagen */}
        <div className="image-section">
          <div className="image-overlay"></div>
        </div>

        {/* Sección del Formulario */}
        <div className="form-section">
          <h2>Registrate Aquí</h2>
          <form className="register-form" onSubmit={handleSubmit}>
            {/* Campos del formulario */}
            <label>
              Nombre <span className="required-asterisk">*</span>
              <input
                type="text"
                name="nombre"
                placeholder="Juan"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="full-width"
              />
            </label>
            <label>
              Apellido Paterno <span className="required-asterisk">*</span>
              <input
                type="text"
                name="apellidoPaterno"
                placeholder="Perez"
                value={formData.apellidoPaterno}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Apellido Materno <span className="required-asterisk">*</span>
              <input
                type="text"
                name="apellidoMaterno"
                placeholder="Gonzalez"
                value={formData.apellidoMaterno}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Fecha de Nacimiento <span className="required-asterisk">*</span>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Género <span className="required-asterisk">*</span>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                required
              >
                <option value="" disabled hidden>
                  Seleccione su género
                </option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
              </select>
            </label>
            <label>
              Altura (CM) <span className="required-asterisk">*</span>
              <input
                type="number"
                name="altura"
                placeholder="165"
                value={formData.altura}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Peso (KG) <span className="required-asterisk">*</span>
              <input
                type="number"
                name="peso"
                placeholder="70"
                value={formData.peso}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Teléfono (Sin +59) <span className="required-asterisk">*</span>
              <input
                type="tel"
                name="telefono"
                placeholder="985345174"
                value={formData.telefono}
                onChange={handleChange}
                required
                className="full-width"
              />
            </label>
            <label>
              Dirección <span className="required-asterisk">*</span>
              <input
                type="text"
                name="direccion"
                placeholder="Alameda 62"
                value={formData.direccion}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Comuna <span className="required-asterisk">*</span>
              <input
                type="text"
                name="comuna"
                placeholder="Santiago"
                value={formData.comuna}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Ingrese su correo <span className="required-asterisk">*</span>
              <input
                type="email"
                name="correo"
                placeholder="correo@gmail.com"
                value={formData.correo}
                onChange={handleChange}
                required
                className="full-width"
              />
            </label>
            <label>
              Contraseña <span className="required-asterisk">*</span>
              <input
                type="password"
                name="contrasena"
                placeholder="Ingrese su contraseña"
                value={formData.contrasena}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Confirmar contraseña <span className="required-asterisk">*</span>
              <input
                type="password"
                name="confirmarContrasena"
                placeholder="Confirme su contraseña"
                value={formData.confirmarContrasena}
                onChange={handleChange}
                required
              />
            </label>
            <div className="checkbox-container">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                Acepto todos los términos y la Política de Privacidad{" "}
                <span className="required-asterisk">*</span>
              </label>
            </div>
            <div className="terms-and-conditions-container">
              <button
                type="button"
                onClick={handleToggleTerms}
                className="view-terms-button"
              >
                <p>Ver Términos y Política de Privacidad</p>
              </button>
            </div>
            <button type="submit" className="register-button">
              Crear Cuenta
            </button>
          </form>
          <p className="already-member">
            ¿Ya tienes una cuenta?{" "}
            <a href="/inicio-de-sesion">Iniciar Sesión</a>
          </p>
        </div>
      </div>
      <TermsAndPolicy isVisible={showTerms} onClose={handleToggleTerms} />
    </div>
  );
};

export default RegisterPage;
