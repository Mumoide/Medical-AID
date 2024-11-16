// PasswordRecoveryPage.js
import React, { useState } from "react";
import Swal from "sweetalert2";
import VerifyRecoveryCode from "../../../Components/VerifyRecoveryCode/VerifyRecoveryCode";
import ResetPassword from "../../../Components/ResetPassword/ResetPassword";
import "./PasswordRecoveryPage.css";

function PasswordRecoveryPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // Step control (1: email input, 2: code verification, 3: reset password)
  const [recoveryCode, setRecoveryCode] = useState("");

  // Function to send the recovery code to the user's email
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3001/api/users/password-recovery/send-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

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
      }).then(() => setStep(2));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al enviar correo",
        text: error.message || "Por favor intente nuevamente.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#d33",
      });
    }
  };

  // Function to handle successful code verification
  const handleCodeVerified = (code) => {
    setRecoveryCode(code);
    setStep(3); // Proceed to reset password step
  };

  return (
    <div className="password-recovery-page">
      {step === 1 && (
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
      )}

      {step === 2 && (
        <VerifyRecoveryCode
          email={email}
          onCodeVerified={handleCodeVerified} // Pass the code verification handler
        />
      )}

      {step === 3 && (
        <ResetPassword
          email={email}
          recoveryCode={recoveryCode} // Pass email and recovery code to reset password component
        />
      )}
    </div>
  );
}

export default PasswordRecoveryPage;
