import React, { useState } from "react";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    fechaNacimiento: "",
    genero: "",
    altura: "",
    peso: "",
    telefono: "",
    direccion: "",
    comuna: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Combine Apellido Paterno and Apellido Materno before submission
    const fullApellidos = `${formData.apellidoPaterno} ${formData.apellidoMaterno}`;

    const finalFormData = {
      ...formData,
      apellidos: fullApellidos, // Combine both into one for the submission
    };

    console.log(finalFormData);
  };

  return (
    <div className="register-page">
      <div className="spacer"></div>
      <div className="spacer"></div>
      <header className="register-header">
        <h1>¡REGÍSTRATE AQUÍ!</h1>
      </header>

      <div className="register-form-container">
        <h2>Información Personal</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <label>
            Nombre <span className="red-asterisk">*</span>
            <input
              type="text"
              name="nombre"
              placeholder="Juan"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="full-width"
            />
          </label>
          <div className="two-column">
            <label>
              Apellido Paterno <span className="red-asterisk">*</span>
              <input
                type="text"
                name="apellidoPaterno"
                placeholder="Perez"
                value={formData.apellidoPaterno}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Apellido Materno <span className="red-asterisk">*</span>
              <input
                type="text"
                name="apellidoMaterno"
                placeholder="Gonzalez"
                value={formData.apellidoMaterno}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className="two-column">
            <label>
              Fecha de Nacimiento <span className="red-asterisk">*</span>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Género
              <input
                type="text"
                name="genero"
                placeholder="Género"
                value={formData.genero}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className="two-column">
            <label>
              Altura (CM)
              <input
                type="number"
                name="altura"
                placeholder="165"
                value={formData.altura}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Peso (KG)
              <input
                type="number"
                name="peso"
                placeholder="70"
                value={formData.peso}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <label>
            Teléfono celular (+569) <span className="red-asterisk">*</span>
            <input
              type="tel"
              name="telefono"
              placeholder="985345174"
              value={formData.telefono}
              onChange={handleChange}
              required
              className="full-width"
            />
          </label>
          <div className="two-column">
            <label>
              Dirección <span className="red-asterisk">*</span>
              <input
                type="text"
                name="direccion"
                placeholder="Alameda 62"
                value={formData.direccion}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Comuna <span className="red-asterisk">*</span>
              <input
                type="text"
                name="comuna"
                placeholder="Santiago"
                value={formData.comuna}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <label>
            Ingrese su correo <span className="red-asterisk">*</span>
            <input
              type="email"
              name="correo"
              placeholder="correo@gmail.com"
              value={formData.correo}
              onChange={handleChange}
              required
              className="full-width"
            />
          </label>
          <div className="two-column">
            <label>
              Contraseña <span className="red-asterisk">*</span>
              <input
                type="password"
                name="contrasena"
                placeholder="Ingrese su contraseña"
                value={formData.contrasena}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Confirmar contraseña <span className="red-asterisk">*</span>
              <input
                type="password"
                name="confirmarContrasena"
                placeholder="Confirme su contraseña"
                value={formData.confirmarContrasena}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <p className="mandatory-fields">
            <span className="red-asterisk">*</span> Campos Obligatorios
          </p>
          <button type="submit" className="register-button">
            Crear Cuenta
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
