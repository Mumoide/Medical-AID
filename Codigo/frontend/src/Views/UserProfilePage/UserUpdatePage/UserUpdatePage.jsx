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
        title: "Success",
        text: "Profile updated successfully!",
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
      <h1>Update Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
        </label>
        <label>
          Apellido Paterno:
          <input
            type="text"
            name="apellidoPaterno"
            value={formData.apellidoPaterno}
            onChange={handleChange}
          />
        </label>
        <label>
          Apellido Materno:
          <input
            type="text"
            name="apellidoMaterno"
            value={formData.apellidoMaterno}
            onChange={handleChange}
          />
        </label>
        <label>
          Fecha de Nacimiento:
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
          />
        </label>
        <label>
          Género:
          <select name="genero" value={formData.genero} onChange={handleChange}>
            <option value="Prefiero no decirlo">Prefiero no decirlo</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </label>
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
        <label>
          Teléfono:
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </label>
        <label>
          Dirección:
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
          />
        </label>
        <label>
          Comuna:
          <input
            type="text"
            name="comuna"
            value={formData.comuna}
            onChange={handleChange}
          />
        </label>
        <label>
          Correo:
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
          />
        </label>
        <button type="submit" className="submit-button">
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default UserUpdatePage;
