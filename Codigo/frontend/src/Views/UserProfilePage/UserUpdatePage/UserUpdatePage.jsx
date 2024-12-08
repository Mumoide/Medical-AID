import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./UserUpdatePage.css";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserUpdatePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const userProfile = location.state?.userProfile;
  useEffect(() => console.log(userProfile), [userProfile]);

  const [formData, setFormData] = useState({
    nombre: userProfile?.nombre || "",
    apellidoPaterno: userProfile?.apellidoPaterno || "",
    apellidoMaterno: userProfile?.apellidoMaterno || "",
    fechaNacimiento: userProfile?.fechaNacimiento || "",
    genero: userProfile?.genero || "",
    altura:
      userProfile?.altura === "No registrada."
        ? null
        : userProfile.altura || "",
    peso:
      userProfile?.peso === "No registrado." ? null : userProfile.peso || "",
    telefono:
      userProfile?.telefono === "No registrado"
        ? null
        : userProfile.telefono || "",
    direccion:
      userProfile?.direccion === "No registrado"
        ? null
        : userProfile.direccion || "",
    comuna:
      userProfile?.comuna === "No registrado" ? null : userProfile.comuna || "",
    correo: userProfile?.correo || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

    if (birthDate > currentDate) {
      toast.error("La fecha de nacimiento no puede estar en el futuro.");
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

    return true;
  };

  const handleBackClick = () => {
    navigate("/profile");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const updatedData = {
      email: formData.correo,
      profile: {
        names: formData.nombre,
        last_names: `${formData.apellidoPaterno} ${formData.apellidoMaterno}`,
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
      const response = await fetch(`http://localhost:3001/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Swal.fire(
          "Error",
          errorData.error || "Error al actualizar perfil",
          "error"
        );
        return;
      }

      Swal.fire({
        title: "Éxito",
        text: "¡Perfil actualizado correctamente!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => navigate("/profile"));
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire(
        "Error",
        "An error occurred while updating your profile.",
        "error"
      );
    }
  };

  return (
    <div className="user-update-page">
      <ToastContainer />
      <div className="spacer"></div>
      <header className="register-header-update-page">
        <h1>Actualizar Perfil</h1>
      </header>
      <div className="user-update-form-container">
        <h2>Información Personal</h2>
        <form className="user-update-form" onSubmit={handleSubmit}>
          <label>
            Nombre: <span className="red-asterisk">*</span>
            <input
              type="text"
              required
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="full-width-update-page"
            />
          </label>

          <div className="two-column-pair-update-page">
            <label>
              Apellido Paterno: <span className="red-asterisk">*</span>
              <input
                type="text"
                name="apellidoPaterno"
                value={formData.apellidoPaterno}
                required
                onChange={handleChange}
              />
            </label>
            <label>
              Apellido Materno: <span className="red-asterisk">*</span>
              <input
                type="text"
                name="apellidoMaterno"
                value={formData.apellidoMaterno}
                required
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="two-column-pair-update-page">
            <label>
              Fecha de Nacimiento: <span className="red-asterisk">*</span>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                required
                onChange={handleChange}
              />
            </label>
            <label>
              Género:
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
              >
                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </label>
          </div>

          <div className="two-column-pair-update-page">
            <label>
              Altura (cm):
              <input
                type="number"
                name="altura"
                value={formData.altura}
                onChange={handleChange}
              />
            </label>
            <label>
              Peso (kg):
              <input
                type="number"
                name="peso"
                value={formData.peso}
                onChange={handleChange}
              />
            </label>
          </div>

          <label>
            Teléfono: <span className="red-asterisk">*</span>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              required
              onChange={handleChange}
              className="full-width-update-page"
            />
          </label>

          <div className="two-column-pair-update-page">
            <label>
              Dirección: <span className="red-asterisk">*</span>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                required
                onChange={handleChange}
              />
            </label>
            <label>
              Comuna: <span className="red-asterisk">*</span>
              <input
                type="text"
                name="comuna"
                value={formData.comuna}
                required
                onChange={handleChange}
              />
            </label>
          </div>

          <label>
            Correo: <span className="red-asterisk">*</span>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              required
              onChange={handleChange}
              className="full-width-update-page"
            />
          </label>
          <p className="mandatory-fields-update">
            <span className="red-asterisk">*</span> Campos Obligatorios
          </p>
          <div className="button-container-update-page">
            <button type="submit" className="submit-button-update-page">
              Actualizar Perfil
            </button>
            <button
              onClick={handleBackClick}
              className="back-button-update-page"
            >
              Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserUpdatePage;
