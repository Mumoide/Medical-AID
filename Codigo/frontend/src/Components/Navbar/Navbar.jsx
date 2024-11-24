import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import AlertList from "../AlertList/AlertList"; // Adjust path as needed

function Navbar({
  isLoggedIn,
  roleId,
  userEmail,
  onLogout,
  alertsData,
  alertsCount,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAlertList, setShowAlertList] = useState(false); // State for alert list visibility
  const dropdownRef = useRef(null); // Create a ref for the dropdown

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Detect clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); // Close the menu
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className="navbar">
      <ul className="nav-list left-nav">
        <li className="nav-item">
          <a href="/">Inicio</a>
        </li>
        <li className="nav-item">
          <a href="/biblioteca-de-diagnosticos">Biblioteca de Diagnósticos</a>
        </li>
        {[1, 2, "1", "2"].includes(roleId) ? (
          <li className="nav-item">
            <a href="/admin">Administración</a>
          </li>
        ) : (
          <></>
        )}
      </ul>

      <div className="navbar-logo">
        <a href="/">
          <img
            src="/images/logos/LogoRound.png"
            target="/"
            alt="Medical AID Logo"
          />
          <p>Medical Aid</p>
        </a>
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
            <li className="nav-item-profile">
              <div>
                <a href="/profile">
                  <p>{userEmail} </p>
                  <img
                    src="/images/icons/profile-icon.png"
                    target="/"
                    alt="profile-icon"
                  />
                </a>
              </div>
              <div
                className="alert-icon-container"
                onClick={() => setShowAlertList(true)}
              >
                <img
                  src="/images/icons/bell-icon.png"
                  target="/"
                  alt="bell-icon"
                />
                {alertsCount > 0 && (
                  <span className="alert-count">{alertsCount}</span>
                )}
              </div>
            </li>
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
      {/* Show AlertList component when showAlertList is true */}
      {showAlertList && (
        <AlertList
          alertsData={alertsData}
          onClose={() => setShowAlertList(false)}
        />
      )}
      <div className="dropdown" ref={dropdownRef}>
        <a className="dropdown-name" href="/profile">
          <p>{userEmail}</p>
          <img
            src="/images/icons/profile-icon.png"
            target="/"
            alt="profile-icon"
          />
        </a>
        <div
          className="alert-icon-container"
          onClick={() => setShowAlertList(true)}
        >
          <img src="/images/icons/bell-icon.png" target="/" alt="bell-icon" />
          {alertsCount > 0 && (
            <span className="alert-count">{alertsCount}</span>
          )}
        </div>
        <button className="dropdown-toggle" onClick={toggleMenu}>
          Menu
        </button>

        <div className={`dropdown-menu ${isOpen ? "open" : ""}`}>
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
      </div>
      {isOpen && <div className="navbar-overlay" onClick={toggleMenu}></div>}
    </nav>
  );
}

export default Navbar;
