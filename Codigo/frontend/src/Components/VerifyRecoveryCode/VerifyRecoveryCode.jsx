// VerifyRecoveryCode.js
import React, { useState } from "react";
import Swal from "sweetalert2";
import "./VerifyRecoveryCode.css";

function VerifyRecoveryCode({ email, onCodeVerified }) {
  const [code, setCode] = useState("");

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3001/api/users/password-recovery/verify-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, recoveryCode: code }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error verifying code");
      }

      Swal.fire({
        icon: "success",
        title: "Código Verificado",
        text: "El código es correcto. Ahora puedes cambiar tu contraseña.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#3690a4",
      }).then(() => onCodeVerified(code)); // Call onCodeVerified on success
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al verificar código",
        text: error.message || "Por favor intente nuevamente.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="verify-code-page">
      <div className="verify-code-container">
        <h2>Verificar Código de Recuperación</h2>
        <form onSubmit={handleVerifyCode}>
          <input
            type="text"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ingrese el código de recuperación"
            className="verify-code-input"
            required
          />
          <button type="submit" className="verify-code-button">
            Verificar Código
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyRecoveryCode;
