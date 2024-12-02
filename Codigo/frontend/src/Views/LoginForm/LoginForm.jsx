import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./LoginForm.css";
import { jwtDecode } from "jwt-decode";

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
      console.log(data);
      localStorage.setItem("token", data.token);
      const decodedToken = jwtDecode(data.token);
      const nombre = decodedToken.nombre;
      const role_id = decodedToken.role_id;

      // Llama al callback onLoginSuccess para actualizar el estado
      onLoginSuccess(nombre, role_id);

      Swal.fire({
        icon: "success",
        title: "¡Inicio de sesión exitoso!",
        text: "Bienvenid@ de nuevo.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#3690a4",
      }).then(() => {
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
      console.error("Error durante el inicio de sesión:", error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-container">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Su dirección de correo electrónico"
              className="login-input"
              required
            />
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              className="login-input"
              required
            />
            <button type="submit" className="login-button">
              Acceder
            </button>
          </form>
          <a
            href="/recuperar-contrasena"
            className="forgot-password"
            onClick={(e) => {
              e.preventDefault();
              navigate("/recuperar-contrasena");
            }}
          >
            Olvidé mi contraseña
          </a>
        </div>
        <div className="register-container-form">
          <h2>¿No estás registrado?</h2>
          <p>
            Si aún no tienes una cuenta, puedes registrarte ahora para acceder a
            Medical AID.
          </p>
          <br />
          <button
            className="register-button"
            onClick={() => navigate("/registro")}
          >
            Regístrese ahora
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
