// UpdateUser.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Use react-router-dom's useParams and useNavigate hooks
import "./UpdateUser.css";
import axios from "axios"; // Import axios
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheck } from "react-icons/fa"; // Import the check icon
import Swal from "sweetalert2";

const UpdateUser = ({ roleId }) => {
  const { id } = useParams(); // Get user ID from URL params
  const navigate = useNavigate();
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
    role: "User", // Set default role
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token from storage
            },
          }
        );
        const user = response.data;

        // Populate form data with defaults if fields are null or undefined
        setFormData({
          nombre: user.profile?.names || "N/A",
          apellidoPaterno: user.profile?.last_names?.split(" ")[0] || "N/A",
          apellidoMaterno: user.profile?.last_names?.split(" ")[1] || "N/A",
          fechaNacimiento: user.profile?.birthdate || "",
          genero: user.profile?.gender || "Prefiero no decirlo",
          altura: user.profile?.height || "",
          peso: user.profile?.weight || "",
          telefono: user.profile?.phone_number || "",
          direccion: user.profile?.address || "N/A",
          comuna: user.profile?.comune || "N/A",
          correo: user.email || "N/A",
          role: user.roles[0]?.role?.role_name || "User",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        Swal.fire("Error", "Failed to load user data.", "error");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  // Back button click handler to navigate back to /form
  const handleBackClick = () => {
    navigate("/admin/users");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const currentDate = new Date();
    const birthDate = new Date(formData.fechaNacimiento);
    const currentYear = currentDate.getFullYear();
    const birthYear = birthDate.getFullYear();
    const age = currentYear - birthYear;

    const lettersRegex = /^[a-zA-ZÀ-ÿ\s]+$/; // Regex to allow only letters and spaces
    const numbersRegex = /^[0-9]+$/; // Regex to allow only integer numbers
    const decimalNumbersRegex = /^[0-9]+(\.[0-9]+)?$/; // Regex to allow integers or decimals

    if (formData.nombre.length > 30 || !lettersRegex.test(formData.nombre)) {
      toast.error(
        "El nombre no debe tener más de 30 caracteres y solo debe incluir letras."
      );
      return false;
    }

    if (birthDate > currentDate) {
      toast.error("La fecha de nacimiento no puede estar en el futuro.");
      return false;
    }

    if (
      formData.apellidoPaterno.length > 20 ||
      !lettersRegex.test(formData.apellidoPaterno)
    ) {
      toast.error(
        "El apellido paterno no debe tener más de 20 caracteres y solo debe incluir letras."
      );
      return false;
    }

    if (
      formData.apellidoMaterno.length > 20 ||
      !lettersRegex.test(formData.apellidoMaterno)
    ) {
      toast.error(
        "El apellido materno no debe tener más de 20 caracteres y solo debe incluir letras."
      );
      return false;
    }

    if (age > 110) {
      toast.error("La fecha de nacimiento no puede ser mayor de 110 años.");
      return false;
    }

    if (
      formData.genero &&
      !["Masculino", "Femenino", "Prefiero no decirlo"].includes(
        formData.genero
      )
    ) {
      toast.error("Género inválido.");
      return false;
    }

    if (
      formData.altura &&
      (!decimalNumbersRegex.test(formData.altura) ||
        formData.altura < 30 ||
        formData.altura > 220)
    ) {
      toast.error(
        "La altura debe estar entre 30 y 220 cm, y solo debe incluir números."
      );
      return false;
    }

    if (
      formData.peso &&
      (!decimalNumbersRegex.test(formData.peso) ||
        formData.peso < 2 ||
        formData.peso > 300)
    ) {
      toast.error(
        "El peso debe estar entre 2 y 300 kg, y solo debe incluir números."
      );
      return false;
    }

    if (
      formData.telefono.length !== 9 ||
      !numbersRegex.test(formData.telefono)
    ) {
      toast.error(
        "El número de teléfono debe tener 9 dígitos y solo debe incluir números."
      );
      return false;
    }

    if (formData.direccion.length > 50) {
      toast.error("La dirección no debe tener más de 50 caracteres.");
      return false;
    }

    if (formData.comuna.length > 50) {
      toast.error("La comuna no debe tener más de 50 caracteres.");
      return false;
    }

    if (formData.correo.length > 60) {
      toast.error("El correo no debe tener más de 60 caracteres.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const fullApellidos = `${formData.apellidoPaterno} ${formData.apellidoMaterno}`;

    // Prepare the final form data, replacing empty strings with null for numeric fields
    const finalFormData = {
      email: formData.correo,
      profile: {
        names: formData.nombre,
        last_names: fullApellidos,
        birthdate: formData.fechaNacimiento,
        gender: formData.genero,
        height: formData.altura === "" ? null : formData.altura, // Replace empty strings with null
        weight: formData.peso === "" ? null : formData.peso, // Replace empty strings with null
        phone_number: formData.telefono,
        address: formData.direccion,
        comune: formData.comuna,
      },
      role: formData.role, // Include the role in the request data
    };

    try {
      await axios.put(`http://localhost:3001/api/users/${id}`, finalFormData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token from storage
        },
      });
      toast.success(
        <div style={{ display: "flex", alignItems: "center", color: "white" }}>
          <span>¡Usuario actualizado exitosamente!</span>
          <FaCheck
            style={{
              marginLeft: "30px",
              color: "white",
              backgroundColor: "#32b00c",
              borderRadius: "50%",
              padding: "5px",
              fontSize: "24px",
            }}
          />
        </div>,
        {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          icon: false,
          style: {
            backgroundColor: "#3690a4",
            minWidth: "500px",
          },
          onClose: () => navigate("/admin/users"),
        }
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data.error || "Error al actualizar el usuario",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#b00c0c",
      });
      console.error(
        "Error updating user:",
        error.response?.data || error.message
      );
    }
  };

  if (loading) return <p>Loading user data...</p>;

  return (
    <div className="register-user-admin-page">
      <ToastContainer />
      <div className="spacer"></div>
      <header className="register-user-admin-header">
        <h1>Actualizar Usuario</h1>
      </header>

      <div className="register-form-update-page-container">
        <h2>Información Personal</h2>
        <form className="register-form-update-page" onSubmit={handleSubmit}>
          <label>
            Nombre <span className="red-asterisk">*</span>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="full-width"
            />
          </label>
          <div className="two-column-update-user">
            <label>
              Apellido Paterno <span className="red-asterisk">*</span>
              <input
                type="text"
                name="apellidoPaterno"
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
                value={formData.apellidoMaterno}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className="two-column-update-user">
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
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
              >
                <option value="" disabled hidden>
                  Seleccione su género
                </option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
              </select>
            </label>
          </div>
          <div className="two-column-update-user">
            <label>
              Altura (CM)
              <input
                type="number"
                name="altura"
                value={formData.altura}
                onChange={handleChange}
              />
            </label>
            <label>
              Peso (KG)
              <input
                type="number"
                name="peso"
                value={formData.peso}
                onChange={handleChange}
              />
            </label>
          </div>
          <label>
            Teléfono celular (+569) <span className="red-asterisk">*</span>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              className="full-width"
            />
          </label>
          <div className="two-column-update-user">
            <label>
              Dirección <span className="red-asterisk">*</span>
              <input
                type="text"
                name="direccion"
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
                value={formData.comuna}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <label>
            Correo electrónico <span className="red-asterisk">*</span>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
              className="full-width"
            />
          </label>
          {[1, "1"].includes(roleId) ? (
            <label>
              Rol del Usuario <span className="red-asterisk">*</span>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="full-width"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </label>
          ) : (
            <></>
          )}
          <div className="button-container">
            <button type="submit" className="register-button">
              Actualizar Usuario
            </button>
            <button onClick={handleBackClick} className="back-button">
              Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
