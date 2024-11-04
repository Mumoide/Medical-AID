import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="main-container">
      {/* Hero Section */}
      <section
        className="hero-section-homepage"
        style={{
          backgroundImage: "url(/images/backgrounds/background-image.jpeg)",
        }}
      >
        <div className="hero-content-homepage">
          <h1>Diagnósticos Remotos</h1>
          <p>
            Medical AID utiliza IA para diagnósticos médicos remotos basados en
            síntomas ingresados.
          </p>
          <button
            className="cta-button"
            onClick={() => (window.location.href = "/diagnostico")}
          >
            Iniciar Diagnóstico
          </button>
        </div>
      </section>

      {/* Cómo Funciona Section */}
      <section className="como-funciona-homepage">
        <div className="funciona-content-homepage">
          <div className="funciona-image-homepage">
            <img src="/images/medical-character.png" alt="Medical Character" />
          </div>
          <div className="funciona-text-homepage">
            <h2>Cómo Funciona</h2>
            <p>Descubre el proceso detrás de nuestra tecnología.</p>
            <button className="ver-mas-button-homepage">Ver Más</button>
          </div>
        </div>

        {/* Process Steps */}
        <div className="funciona-steps-homepage">
          <div className="step-homepage">
            <img
              src="/images/icons/icon-symptoms.png"
              alt="Ingresar Síntomas"
            />
            <h3>Ingresar Síntomas</h3>
            <p>Los usuarios ingresan sus síntomas en la plataforma.</p>
          </div>
          <div className="step-homepage">
            <img
              src="/images/icons/icon-ia-analysis.png"
              alt="Análisis de IA"
            />
            <h3>Análisis de IA</h3>
            <p>La inteligencia artificial analiza los síntomas ingresados.</p>
          </div>
          <div className="step-homepage">
            <img
              src="/images/icons/icon-diagnosis.png"
              alt="Diagnóstico Remoto"
            />
            <h3>Diagnóstico Remoto</h3>
            <p>Recibe un diagnóstico médico basado en el análisis de IA.</p>
          </div>
        </div>
      </section>

      {/* Beneficios Section */}
      <section className="beneficios-section-homepage">
        <h2>Beneficios</h2>
        <p>Ventajas de usar Medical AID</p>

        <div className="beneficios-content-homepage">
          <div className="beneficio-homepage">
            <img src="/images/icons/accesibilidad.png" alt="Accesibilidad" />
            <h3>Accesibilidad</h3>
            <p>Diagnósticos médicos desde cualquier lugar.</p>
          </div>
          <div className="beneficio-homepage">
            <img src="/images/icons/precision.png" alt="Precisión" />
            <h3>Precisión</h3>
            <p>Análisis detallado y preciso de síntomas.</p>
          </div>
          <div className="beneficio-homepage">
            <img src="/images/icons/rapidez.png" alt="Rapidez" />
            <h3>Rapidez</h3>
            <p>Obtén resultados en minutos.</p>
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="suscripcion-section-homepage">
        <div className="suscripcion-content-homepage">
          <img src="/images/logos/LogoRound.png" alt="Medical AID Logo" />
          <h2>Diagnósticos Inteligentes</h2>
          <p>Suscribirse para recibir actualizaciones.</p>
          <div className="suscripcion-form-homepage">
            <input
              type="email"
              className="subscription-input-homepage"
              placeholder="Ingresa tu email"
            />
            <button>Suscribirse</button>
          </div>
          <p className="privacy-note-homepage">
            Al suscribirse aceptas nuestra Política de Privacidad
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
