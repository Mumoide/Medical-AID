import React from 'react';
import './Spinner.css';
import Navbar from './Navbar'; // Import the Navbar component

function Spinner() {
  return (
    <div>
      <Navbar /> {/* Add the Navbar component here */}
      <div className="spinner-container">
        <div className="spinner"></div>
        <p className="spinner-text">Medical AID in development</p>
        
        <form className="medical-form">
          <div className="form-group">
            <label htmlFor="nombres">Nombres:</label>
            <input type="text" id="nombres" name="nombres" placeholder="Ingrese sus nombres completos" />
          </div>
          
          <div className="form-group">
            <label htmlFor="edad">Edad:</label>
            <input type="number" id="edad" name="edad" placeholder="Ingrese su edad en años" />
          </div>
          
          <div className="form-group">
            <label htmlFor="sintomas">Síntomas:</label>
            <input type="text" id="sintomas" name="sintomas" placeholder="Describa brevemente sus síntomas" />
          </div>
          
          <div className="form-group">
            <label htmlFor="descripcion">Descripción:</label>
            <textarea id="descripcion" name="descripcion" placeholder="Proporcione una descripción detallada de sus síntomas y cualquier otra información relevante"></textarea>
          </div>
          
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
}

export default Spinner;
