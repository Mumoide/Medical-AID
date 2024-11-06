import React, { useState } from "react";
import "./Navbar.css";

function Navbar({ isLoggedIn, userEmail, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <ul className="nav-list left-nav">
        <li className="nav-item">
          <a href="/">Inicio</a>
        </li>
        <li className="nav-item">
          <a href="/biblioteca-de-diagnosticos">Biblioteca de Diagnosticos</a>
        </li>
        <li className="nav-item">
          <a href="/admin">Administración</a>
        </li>
      </ul>

      <div className="navbar-logo">
        <img src="/images/logos/LogoRound.png" alt="Medical AID Logo" />
      </div>

      <ul className="nav-list right-nav">
        <li className="nav-item">
          <a href="/about-us">Nosotros</a>
        </li>
        {!isLoggedIn ? (
          <>
            <li className="nav-item">
              <a href="/inicio-de-sesion">Iniciar Sesión</a>
            </li>
            <li className="nav-item">
              <a href="/registro">Registrarse</a>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">{userEmail}</li>
            <li className="nav-item">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default anchor navigation
                  onLogout(); // Call the logout function
                }}
              >
                Cerrar Sesión
              </a>
            </li>
          </>
        )}
      </ul>

      <div className="dropdown">
        <button className="dropdown-toggle" onClick={toggleMenu}>
          Menu
        </button>
        {isOpen && (
          <div className="dropdown-menu">
            <a className="dropdown-item" href="/">
              Inicio
            </a>
            <a className="dropdown-item" href="/biblioteca-de-diagnosticos">
              Biblioteca de diagnosticos
            </a>
            <a className="dropdown-item" href="/admin">
              Administración
            </a>
            <a className="dropdown-item" href="/about-us">
              Nosotros
            </a>
            {!isLoggedIn ? (
              <>
                <a className="dropdown-item" href="/inicio-de-sesion">
                  Iniciar Sesión
                </a>
                <a className="dropdown-item" href="/registro">
                  Registrarse
                </a>
              </>
            ) : (
              <>
                <span className="dropdown-item">{userEmail}</span>
                <a
                  className="dropdown-item"
                  href="/"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default anchor navigation
                    onLogout(); // Call the logout function
                  }}
                >
                  Cerrar Sesión
                </a>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
