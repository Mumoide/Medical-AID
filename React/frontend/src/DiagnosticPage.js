import React from 'react';
import './DiagnosticPage.css'; // Assuming you have a CSS file for styling

function DiagnosticPage() {
  return (
    <div className="diagnostic-container">
      <div className="diagnostic-image">
        {/* Add the image here */}
        <img src="/images/brain-image.png" alt="Brain Visual" />
      </div>
      <div className="diagnostic-content">
        <p>Medical AID utiliza IA para ofrecer diagnósticos médicos remotos.</p>
        <div className="diagnostic-buttons">
          <button className="start-diagnostic">Iniciar Diagnóstico</button>
          <button className="more-info">Más Información</button>
        </div>
      </div>
    </div>
  );
}

export default DiagnosticPage;
