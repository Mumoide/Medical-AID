import "./Footer.css";

const FooterPage = () => {
  return (
    <div>
      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <a href="/spinner">Política de Privacidad</a>
          <a href="/spinner">Términos de Servicio</a>
          <a href="/spinner">Configuración de Cookies</a>
        </div>
        <div className="footer-copyright">
          &copy; 2024 Medical AID™. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default FooterPage;
