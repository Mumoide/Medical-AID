import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Use react-router-dom's useNavigate hook
import "./LoginForm.css";
import Swal from "sweetalert2";

function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("user_id", data.userId);
      localStorage.setItem("user_name", data.nombre);

      // Call the onLoginSuccess callback to update the state
      onLoginSuccess(data.nombre);

      Swal.fire({
        icon: "success",
        title: "¡Inicio de sesión exitoso!",
        text: "Bienvenid@ de nuevo.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#3690a4",
      }).then(() => {
        // Reload the page after the user clicks "Aceptar" in the alert
        navigate("/");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: error.message || "Por favor intente nuevamente.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#d33",
      });
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="login-container">
      <h2>Inicio de sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingrese su correo Electronico"
          className="login-input"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingrese su Contraseña"
          className="login-input"
          required
        />
        <button type="submit" className="login-button">
          Iniciar Sesión
        </button>
        <a href="/forgot-password" className="forgot-password">
          Olvide mi contraseña
        </a>
        <div className="social-login">
          <button type="button" className="social-login-button social-facebook">
            Continuar con Facebook
          </button>
          <button type="button" className="social-login-button social-google">
            Continuar con Google
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
