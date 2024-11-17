import React from "react";
import "./AdminPage.css";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      {/* Header section with an image */}
      <header className="admin-header">
        <div className="admin-header-image-container">
          <img
            src="/images/backgrounds/female-doctor.jpg"
            alt="Admin Header"
            className="admin-header-image"
          />
          <div className="header-overlay">
            <h1>Administración de Usuarios</h1>
            <p>
              Administra y monitorea a los usuarios, sus diagnósticos y alertas.
            </p>
          </div>
        </div>
      </header>

      <section className="logo_medicalAid">
        <img
          src="/images/logos/LogoRound.png"
          alt="Logotipo"
          className="Logotipo_MedicalAID"
        />
      </section>

      <div className="spacer"></div>
      <div className="spacer"></div>
      <div className="spacer"></div>
      {/* Buttons container */}
      <div className="admin-image-container">
        <img
          src="/images/backgrounds/admin-background.jpeg"
          alt="Admin Background"
          className="admin-background-image"
        />
        <div className="admin-buttons">
          <div className="admin-action-card">
            <h2>Administración de Usuarios</h2>
            <button onClick={() => navigate("/admin/users")}>Ver</button>
          </div>
          <div className="admin-action-card">
            <h2>Dashboard de Diagnósticos</h2>
            <button onClick={() => navigate("/admin/dashboard")}>Ver</button>
          </div>
          <div className="admin-action-card">
            <img src="/images/icons/alert-icon.png" alt="Alerts" />
            <h2>Alertas</h2>
            <button onClick={() => navigate("/admin/alerts")}>Ver</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
