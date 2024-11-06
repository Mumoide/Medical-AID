import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./HomePage.css"
import "../LoginForm/LoginForm.css"

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
            className="cta-button-homepage"
            onClick={() => document.getElementById("diagnostic-section").scrollIntoView({ behavior: "smooth" })}
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
            <center>
            <p>Descubre el proceso detrás de nuestra tecnología.</p>
            </center>
            <Link to="/about-us">
            <button className="ver-mas-button-homepage">Ver más</button>
            </Link>
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

 {/* Diagnostic Section */}
 <div className="diagnostic-container" id="diagnostic-section">

    <div className="diagnostic-image v2">
        <img src="/images/brain-image.png" alt="Diagnostic List" className="diagnostic-image img"/>
    </div>

    <div className="diagnostic-content">
        <h2>Diagnóstico Inteligente</h2>
        <p>Obtén resultados rápidos y precisos para tus diagnósticos.</p>
        <div className="diagnostic-buttons">
        <Link to="/form">
            <button className="start-diagnostic">Iniciar Diagnóstico</button>
          </Link>
          <Link to="/about-us">
            <button className="more-info">Más Información</button>
            </Link>
        </div>
        </div>
        </div> 
          <h2 className="comments-heading">Comentarios</h2>
        <div className="comments-section">
    <div className="comment-card">
        <div className="comment-user">
            <img src="/images/user1.jpg" alt="Juan Pérez" className="comment-user-image" />
            <div className="comment-user-info">
                <p className="comment-user-name">Juan Pérez</p>
                <p className="comment-user-title">Usuario</p>
            </div>
        </div>
        <div className="comment-stars">
            ⭐⭐⭐⭐⭐
        </div>
        <p className="comment-text">"Medical AID me proporcionó un diagnóstico rápido y preciso. ¡Muy recomendable!"</p>
    </div>

    <div className="comment-card">
        <div className="comment-user">
            <img src="/images/user2.jpg" alt="Ana Gómez" className="comment-user-image" />
            <div className="comment-user-info">
                <p className="comment-user-name">Ana Gómez</p>
                <p className="comment-user-title">Usuario</p>
            </div>
        </div>
        <div className="comment-stars">
            ⭐⭐⭐⭐⭐
        </div>
        <p className="comment-text">"La plataforma es fácil de usar y los diagnósticos son muy precisos."</p>
    </div>
</div>

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

export default HomePage;