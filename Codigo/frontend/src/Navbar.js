import React, { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      {/* Left navigation links */}
      <ul className="nav-list left-nav">
        <li className="nav-item"><a href="/">Inicio</a></li>
        <li className="nav-item"><a href="#proyectos">Proyectos</a></li>
        <li className="nav-item"><a href="#equipo">Equipo</a></li>
      </ul>

      {/* Center logo */}
      <div className="navbar-logo">
        <img src="/images/logos/LogoRound.png" alt="Medical AID Logo" />
      </div>

      {/* Right navigation links */}
      <ul className="nav-list right-nav">
        <li className="nav-item"><a href="#nosotros">Nosotros</a></li>
        <li className="nav-item"><a href="/Inicio-de-sesion">Iniciar Sesión</a></li>
        <li className="nav-item"><a href="/registro">Registrarse</a>
</li>

      </ul>

      {/* Dropdown Menu Button for Mobile */}
      <div className="dropdown">
        <button className="dropdown-toggle" onClick={toggleMenu}>
          Menu
        </button>
        {isOpen && (
          <div className="dropdown-menu">
            <a className="dropdown-item" href="#inicio">Inicio</a>
            <a className="dropdown-item" href="#proyectos">Proyectos</a>
            <a className="dropdown-item" href="#equipo">Equipo</a>
            <a className="dropdown-item" href="#nosotros">Nosotros</a>
            <a className="dropdown-item" href="#iniciar-sesion">Iniciar Sesión</a>
            <a className="dropdown-item" href="#registrarse">Registrarse</a>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
