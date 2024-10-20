import React from 'react';
import './AdminPage.css';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      {/* Header section with an image */}
      <header className="admin-header">
        <div className="admin-header-image-container">
          <img src="/images/backgrounds/background-image.jpeg" alt="Admin Header" className="admin-header-image" />
          <div className="header-overlay">
            <h1>Administración de Usuarios</h1>
            <p>Administra y monitorea a los usuarios, sus diagnósticos y alertas.</p>
          </div>
        </div>
      </header>

      {/* Logo in the middle of the page */}
      <div className="admin-logo-container">
        <img src="/images/logos/LogoRound.png" alt="Medical AID Logo" className="admin-logo" />
      </div>

      {/* Buttons container */}
      <div className="admin-image-container">
        <img src="/images/backgrounds/admin-background.jpeg" alt="Admin Background" className="admin-background-image" />
        <div className="admin-buttons">
          <div className="admin-action-card">
            <h2>Administración de Usuarios</h2>
            <button onClick={() => navigate('/admin/users')}>Ver</button>
          </div>
          <div className="admin-action-card">
            <h2>Dashboard de Diagnósticos</h2>
            <button>Ver</button>
          </div>
          <div className="admin-action-card">
            <h2>Alertas</h2>
            <button>Ver</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
