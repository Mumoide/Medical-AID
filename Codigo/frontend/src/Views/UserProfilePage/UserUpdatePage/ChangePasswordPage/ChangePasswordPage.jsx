import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ChangePasswordPage.css";

function ChangePasswordPage({ onLogout }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      Swal.fire("Error", "¡Las contraseñas no coinciden!", "error");
      return;
    }

    // Get userId from local storage or session
    const userId = localStorage.getItem("user_id");

    try {
      // Send request to change password
      const response = await axios.post(
        "http://localhost:3001/api/users/update-password",
        {
          userId,
          newPassword: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Contraseña cambiada",
          text: "Se ha cerrado su sesión.",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#3690a4",
        }).then(() => {
          onLogout();
        });
      }
    } catch (error) {
      // Error handling
      Swal.fire(
        "Error",
        error.response?.data?.error || "An error occurred",
        "error"
      );
    }
  };

  return (
    <div className="change-password-container">
      <h1 className="change-password-title">Actualizar Contraseña</h1>
      <p>
        Crea una contraseña segura, con una combinación de letras, números y
        símbolos.
      </p>
      <form onSubmit={handleSubmit} className="change-password-form">
        <div className="change-password-field">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="change-password-input"
          />
        </div>
        <div className="change-password-field">
          <label>Confirmar contraseña:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="change-password-input"
          />
        </div>
        <div className="change-password-buttons">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="change-password-back-button"
          >
            Volver
          </button>
          <button type="submit" className="change-password-submit-button">
            Cambiar contraseña
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePasswordPage;
