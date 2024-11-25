import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./UserUpdatePage.css";
import Swal from "sweetalert2";

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

  const handleBackClick = () => {
    navigate("/profile");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Restructure formData to match backend expectations
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
        const errorData = await response.json(); // Parse the response JSON
        if (response.status === 400 && errorData.error) {
          // Check if error is due to email uniqueness
          Swal.fire("Error", errorData.error, "error");
        } else {
          throw new Error("Failed to update profile");
        }
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
