import React, { useEffect, useRef } from "react";
import "./TermsAndPolicy.css";

const TermsAndPolicy = ({ isVisible, onClose }) => {
  const modalRef = useRef(null); // Reference for the modal content

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Close the modal when clicking outside
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="modal-overlay-terms-and-policy">
      <div className="modal-content-terms-and-policy" ref={modalRef}>
        <button className="close-button-terms-and-policy" onClick={onClose}>
          ×
        </button>
        <h2 className="modal-title-terms-and-policy">
          Términos y Política de Privacidad
        </h2>
        <p className="modal-intro-terms-and-policy">
          Bienvenido(a) a nuestra aplicación. Por favor, lee cuidadosamente
          nuestros términos y condiciones antes de proceder:
        </p>
        <ul className="modal-list-terms-and-policy">
          <li>
            <strong>Propósito de la aplicación:</strong> Esta aplicación tiene
            como objetivo proporcionar información y alertas relacionadas con
            diagnósticos médicos basados en datos ingresados por el usuario.
            Esta información no sustituye el consejo, diagnóstico o tratamiento
            profesional médico.
          </li>
          <li>
            <strong>Limitación de responsabilidad:</strong> Los resultados de
            diagnósticos y alertas generados están basados en modelos de
            aprendizaje automático. No garantizamos la exactitud, precisión o
            completitud de los resultados. Los desarrolladores de la aplicación
            no son responsables por decisiones tomadas basadas en los
            resultados. Siempre consulta a un profesional médico certificado.
          </li>
          <li>
            <strong>Privacidad de datos:</strong> Tus datos personales serán
            tratados conforme a nuestra Política de Privacidad. Implementamos
            medidas para proteger tu información, pero no garantizamos seguridad
            absoluta contra accesos no autorizados.
          </li>
          <li>
            <strong>Actualización de términos:</strong> Nos reservamos el
            derecho de actualizar estos términos en cualquier momento. Te
            notificaremos de cualquier cambio relevante.
          </li>
          <li>
            <strong>Contacto:</strong> Si tienes preguntas o inquietudes, puedes
            comunicarte con nosotros a través de nuestra página de soporte.
          </li>
        </ul>
        <p className="modal-footer-terms-and-policy">
          Gracias por confiar en nosotros. ¡Estamos aquí para ayudarte!
        </p>
      </div>
    </div>
  );
};

export default TermsAndPolicy;
