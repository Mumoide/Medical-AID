import React, { useState } from 'react';
import './LoginForm.css';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      localStorage.setItem('token', data.token); // Store token in localStorage
      alert('Login successful');
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingrese su correo Electronico"
          className="login-input"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingrese su Contraseña"
          className="login-input"
        />
        <button type="submit" className="login-button">Iniciar Sesión</button>
        <a href="/forgot-password" className="forgot-password">Olvide mi contraseña</a>
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
