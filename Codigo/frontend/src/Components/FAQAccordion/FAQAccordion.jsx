import React, { useState } from "react";
import "./FAQAccordion.css";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFAQ = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`faq ${isOpen ? "open" : ""}`} onClick={toggleFAQ}>
      <h3>{question}</h3>
      {isOpen && <p>{answer}</p>}
    </div>
  );
};

const FAQSection = () => {
    const faqData = [
        {
          question: "¿Es seguro el diagnóstico?",
          answer: "Sí, ya que Medical AID utiliza tecnología de machine learning avanzada y está diseñado para proporcionar diagnósticos precisos.",
        },
        {
          question: "¿Cuánto tiempo tarda en obtener el diagnóstico?",
          answer: "En promedio, el diagnóstico se obtiene en cuestión de segundos.",
        },
        {
          question: "¿Necesito una cuenta para acceder a los diagnósticos?",
          answer: "No, puedes acceder a diagnósticos sin crear una cuenta, pero necesitarás crear una cuenta gratuita para generar un historial de diagnósticos.",
        },
        {
          question: "¿Qué tipo de diagnósticos puedo obtener?",
          answer: "Medical AID ofrece 41 diagnósticos médicos diferentes, desde infecciones comunes hasta condiciones crónicas.",
        },
        {
          question: "¿Cómo protege Medical AID mi información?",
          answer: "Utilizamos encriptación avanzada y cumplimos con las regulaciones de privacidad para asegurar la protección de tus datos personales.",
        },
        {
          question: "¿Puedo obtener diagnósticos sin conexión a internet?",
          answer: "No, necesitas estar conectado a internet para acceder a nuestros servicios de diagnóstico remoto.",
        },
        {
          question: "¿Medical AID reemplaza a un médico?",
          answer: "No, Medical AID proporciona diagnósticos preliminares. Siempre recomendamos consultar con un profesional de la salud para un diagnóstico y tratamiento formal.",
        },
        {
          question: "¿Qué sucede si mi diagnóstico es urgente?",
          answer: "Si tu diagnóstico sugiere una condición urgente, Medical AID te recomendará que busques atención médica inmediata.",
        },
        {
          question: "¿Hay algún costo por los diagnósticos?",
          answer: "No, todos los diagnósticos están disponibles de forma gratuita.",
        },
    ];

  return (
    <section className="faq-section">
      <h2>Preguntas Frecuentes</h2>
      {faqData.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </section>
  );
};

export default FAQSection;
