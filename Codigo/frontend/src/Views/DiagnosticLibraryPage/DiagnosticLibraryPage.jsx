import React from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import './DiagnosticLibraryPage.css';

const DiagnosticLibraryPage = () => {
  return (
    <div className="diagnostic-library-container">

      <section className="library-main-content">
        <div className="library-text">
          <h1>Biblioteca De Diagnósticos</h1>
          {/* Add an anchor link that scrolls to the table */}
          <a href="#table-section" className="library-button">Ver</a>
        </div>
        <img 
          src="/images/diagnostic-list.png" 
          alt="Illustration of a diagnostic library" 
          className="library-image" 
        />
      </section>

      {/* Table Section with an ID */}
      <section id="table-section" className="table-section">
        <h2 className="table-title">Diagnosticos</h2>
        <table className="diagnostic-table">
          <thead>
            <tr>
              <th>Condición</th>
              <th>Recomendación</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ejemplo de Condición 1</td>
              <td>Ejemplo de Recomendación 1</td>
            </tr>
            <tr>
              <td>Ejemplo de Condición 2</td>
              <td>Ejemplo de Recomendación 2</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default DiagnosticLibraryPage;
