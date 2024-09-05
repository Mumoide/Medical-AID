import React from 'react';
import './LoginForm.css';

function LoginForm() {
  return (
    <div className="login-container">
                  <h2>Iniciar Sesión</h2>
      <form>
        <input type="email" placeholder="Ingrese su correo Electronico" className="login-input" />
        <input type="password" placeholder="Ingrese su Contraseña" className="login-input" />
        
        <button type="submit" className="login-button">Iniciar Sesión</button>

        <div className="forgot-password">
          <a href="/forgot-password">Olvide mi contraseña</a>
        </div>

        <div className="social-login">
          <button type="button" className="social-login-button social-facebook">Continuar con Facebook</button>
          <button type="button" className="social-login-button social-google">Continuar con Google</button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;

