import React from 'react';
import './AboutUsPage.css';

const AboutUsPage = () => {
  return (
    <div className="about-us-container">
      <header className="header-section"> {/* Updated container class name */}
        <img src="/images/about-us-image.png" alt="Header AI and Doctor" className="header-image" />

        <header className="intro-section">
        <img src="/images/logos/logo-welcome.png"alt="Medical AID Logo" className="intro-image" />
        <p>Estamos encantados de que formes parte de nuestra comunidad. Medical AID es una plataforma diseñada para ofrecer diagnósticos médicos remotos, rápidos y precisos. Con tecnología avanzada de machine learning y un enfoque en la salud accesible, te ayudamos a obtener respuestas claras y confiables sobre tu bienestar.</p>
      </header>
      </header>

      <section className="cta-section">
      <center>
    <a href="/inicio-de-sesion"> {/* Wraps the image in an anchor link */}
      <img src="/images/path-to-us.png" alt="Call to Action" />
          </a>
            </center>
              </section>

      <section className="mission-section">
        <h2>¿Quiénes somos?</h2>
        <div className="mission-items">
          <div className="mission-item">
            <img src="/images/icons/acceso-universal-icon.png" alt="Acceso Universal" className="mission-icon" />
            <h3>Acceso Universal</h3>
            <p>En Medical AID, nuestro objetivo es acercar la salud a todas las personas, sin importar dónde te encuentres.</p>
          </div>
          <div className="mission-item">
            <img src="/images/icons/diagnosticos-rapidos-icon.png" alt="Diagnósticos Rápidos" className="mission-icon" />
            <h3>Diagnósticos Rápidos</h3>
            <p>A través de nuestra plataforma, puedes acceder a 41 diagnósticos médicos diferentes desde la comodidad de tu hogar.</p>
          </div>
          <div className="mission-item">
            <img src="/images/icons/tecnologia-avanzada-icon.png" alt="Tecnología Avanzada" className="mission-icon" />
            <h3>Tecnología Avanzada</h3>
            <p>Con la tecnología de machine learning, analizamos tus síntomas y te ofrecemos resultados precisos en cuestión de segundos.</p>
          </div>
          <div className="mission-item">
            <img src="/images/icons/compromiso-icon.png" alt="Compromiso" className="mission-icon" />
            <h3>Compromiso</h3>
            <p>Nos comprometemos a mejorar la accesibilidad a diagnósticos médicos, apoyando tu salud y bienestar con confianza y precisión.</p>
          </div>
        </div>
      </section>

      <footer className="subscribe-section">
          <h2 className="subscribe-title">Diagnósticos Inteligentes</h2>
        <input type="text" placeholder="Ingresa tu email" className="subscribe-input" />
        <center>
          <p></p>
        <button className="subscribe-button">Suscribirse</button>
        </center>
        <p>Al suscribirte aceptas nuestra Política de Privacidad</p>
      </footer>
    </div>
  );
};

export default AboutUsPage;
