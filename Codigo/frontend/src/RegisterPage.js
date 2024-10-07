import React, { useState } from 'react';
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    fechaNacimiento: '',
    genero: '',
    altura: '',
    telefono: '',
    direccion: '',
    comuna: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    console.log(formData);
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
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="apellidos"
            placeholder="Apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="fechaNacimiento"
            placeholder="Fecha de Nacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="genero"
            placeholder="Género"
            value={formData.genero}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="altura"
            placeholder="Altura (CM)"
            value={formData.altura}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono celular (+569)"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={formData.direccion}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="comuna"
            placeholder="Comuna"
            value={formData.comuna}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="correo"
            placeholder="Ingrese su correo"
            value={formData.correo}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="contrasena"
            placeholder="Cree su contraseña"
            value={formData.contrasena}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmarContrasena"
            placeholder="Ingrese nuevamente la contraseña"
            value={formData.confirmarContrasena}
            onChange={handleChange}
            required
          />
          <p className="mandatory-fields">* Campos Obligatorios</p>
          <button type="submit" className="register-button">Crear Cuenta</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
