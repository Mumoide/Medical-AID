import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <button className="nav-button">Inicio</button>
        </li>
        <li className="nav-item">
          <button className="nav-button">Sobre nosotros</button>
        </li>
        <li className="nav-item">
          <button className="nav-button">Contacto</button>
        </li>
        <li className="nav-item">
          <button className="nav-button">Disclaimer</button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
