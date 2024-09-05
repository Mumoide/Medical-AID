import React, { useState } from 'react';
import './RegisterPage.css'; // Import the CSS

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    edad: '',
    genero: '',
    altura: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted', formData);
  };

  return (
    <div className="register-container">
      <h2>Crear Cuenta</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          required
        />
        <div className="name-inputs">
          <input
            type="text"
            name="apellidoPaterno"
            placeholder="Apellido Paterno"
            value={formData.apellidoPaterno}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="apellidoMaterno"
            placeholder="Apellido Materno"
            value={formData.apellidoMaterno}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="additional-info">
          <input
            type="number"
            name="edad"
            placeholder="Edad"
            value={formData.edad}
            onChange={handleInputChange}
            required
          />
          <select
            name="genero"
            value={formData.genero}
            onChange={handleInputChange}
            required
          >
            <option value="">Género</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>
          <input
            type="number"
            name="altura"
            placeholder="Altura (CM)"
            value={formData.altura}
            onChange={handleInputChange}
            required
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Ingrese su correo electrónico"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Cree una Contraseña"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Crear Cuenta</button>
      </form>
    </div>
  );
};

export default RegisterPage;
