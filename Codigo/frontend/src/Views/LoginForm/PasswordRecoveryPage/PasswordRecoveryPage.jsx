import React, { useState } from "react";
import Swal from "sweetalert2";
import "./PasswordRecoveryPage.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/users/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error sending reset email");
      }

      Swal.fire({
        icon: "success",
        title: "Correo Enviado",
        text: "Revisa tu correo para restablecer tu contraseña.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#3690a4",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al enviar correo",
        text: error.message || "Por favor intente nuevamente.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#d33",
      });
      console.error("Error al enviar correo de restablecimiento:", error);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <h2>Recuperar Contraseña</h2>
        <form onSubmit={handlePasswordReset}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingrese su correo electrónico"
            className="forgot-password-input"
            required
          />
          <button type="submit" className="forgot-password-button">
            Enviar Correo de Restablecimiento
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
