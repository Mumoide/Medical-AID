import React from 'react';
import './AboutUsPage.css';

const AboutUsPage = () => {
  return (
    <div className="about-us-container">
      <header className="header-section"> {/* Updated container class name */}
        <img src="/images/backgrounds/hand-medical.jpg" alt="Header AI and Doctor" className="header-image" />

        <header className="intro-section">
        <img src="/images/logos/LogoRound.png" alt="Imagen Principal" class="image"/>
        <h2>¡Bienvenidos A Medical AID!</h2>
        <p>Estamos encantados de que formes parte de nuestra comunidad. Medical AID es una plataforma diseñada para ofrecer diagnósticos médicos remotos, rápidos y precisos. Con tecnología avanzada de machine learning y un enfoque en la salud accesible, te ayudamos a obtener respuestas claras y confiables sobre tu bienestar.</p>
        <h3>Puedes acceder a <span class="highlight">41 Diagnósticos</span> médicos diferentes.</h3>
        <hr class="line"></hr>
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

      <section class="button-section">
        <div class="button-wrapper">
          <button class="cta-button">Ir a la Biblioteca de Diagnósticos</button>
          <img src="/images/backgrounds/Robot.png" alt="Botón Imagen" class="button-image" />
        </div>
      </section>

      <footer className="subscribe-section">
        <div className="subscribe-info">
          <h2 className="subscribe-title">Diagnósticos Inteligentes</h2>
        </div>
        <div className="subscriibe-content">
          <img src="/images/logos/LogoRound.png" alt="Logo Diagnósticos Remotos" className='Logo'/>
        </div>
        <p className="subcribete-text">Subscríbete a nuestros informativos vía correo electrónico y recibe todas nuestras noticias y actualizaciones.</p>
        <form className="subscribe-form">
          <input type="text" placeholder="Ingresa tu email" className="subscribe-input" />
          <button className="subscribe-button">Suscribirse</button>
        </form>
        <p>Al suscribirte aceptas nuestra Política de Privacidad</p>
        <hr class="custom-line"></hr>
      </footer>
    </div>
  );
};

export default AboutUsPage;
