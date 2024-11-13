// ResetPassword.js
import React, { useState } from "react";
import Swal from "sweetalert2";
import "./ResetPassword.css";

function ResetPassword({ email, recoveryCode }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validate if passwords match
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3001/api/users/password-recovery/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, recoveryCode, newPassword }),
        }
      );
      console.log("entro al endpoint");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error resetting password");
      }
      console.log(response);

      Swal.fire({
        icon: "success",
        title: "Contraseña Restablecida",
        text: "Tu contraseña ha sido actualizada con éxito.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#3690a4",
      }).then(() => {
        window.location.href = "/inicio-de-sesion"; // Redirect to login page
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al restablecer contraseña",
        text: error.message || "Por favor intente nuevamente.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <h2>Restablecer Contraseña</h2>
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="Nueva Contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="reset-password-input"
          />
          <input
            type="password"
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="reset-password-input"
          />
          <button type="submit" className="reset-password-button">
            Restablecer Contraseña
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
