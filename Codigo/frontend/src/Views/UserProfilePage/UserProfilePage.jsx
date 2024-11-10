import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./UserProfilePage.css";
import { FaFileAlt, FaPen } from "react-icons/fa"; // Import icons

function UserProfilePage() {
  const [userProfile, setUserProfile] = useState(null);
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 403) {
          Swal.fire({
            title: "Session Expired",
            text: "Please log in again.",
            icon: "warning",
            confirmButtonText: "OK",
          }).then(() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          });
          return;
        } else if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const user = await response.json();
        setUserProfile({
          nombre: user.profile?.names || "No registrado.",
          apellidoPaterno:
            user.profile?.last_names?.split(" ")[0] || "No registrado.",
          apellidoMaterno:
            user.profile?.last_names?.split(" ")[1] || "No registrado.",
          fechaNacimiento: user.profile?.birthdate || "",
          genero: user.profile?.gender || "Prefiero no decirlo",
          altura: user.profile?.height || "No registrada.",
          peso: user.profile?.weight || "No registrado.",
          telefono: user.profile?.phone_number || "No registrado",
          direccion: user.profile?.address || "No registrado.",
          comuna: user.profile?.comune || "No registrado.",
          correo: user.email || "No registrado.",
          role: user.roles[0]?.role?.role_name || "User",
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        Swal.fire({
          title: "Error",
          text: "An error occurred while fetching your profile. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (!userProfile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="user-profile-page">
      <div className="profile-card">
        <h1 className="profile-title">Perfil de Usuario</h1>
        <div className="profile-info">
          <p>
            <strong>Nombre:</strong> <span>{userProfile.nombre}</span>
          </p>
          <p>
            <strong>Apellido Paterno:</strong>{" "}
            <span>{userProfile.apellidoPaterno}</span>
          </p>
          <p>
            <strong>Apellido Materno:</strong>{" "}
            <span>{userProfile.apellidoMaterno}</span>
          </p>
          <p>
            <strong>Fecha de Nacimiento:</strong>{" "}
            <span>{userProfile.fechaNacimiento}</span>
          </p>
          <p>
            <strong>Género:</strong> <span>{userProfile.genero}</span>
          </p>
          <p>
            <strong>Altura:</strong> <span>{userProfile.altura}</span>
          </p>
          <p>
            <strong>Peso:</strong> <span>{userProfile.peso}</span>
          </p>
          <p>
            <strong>Teléfono:</strong> <span>{userProfile.telefono}</span>
          </p>
          <p>
            <strong>Dirección:</strong> <span>{userProfile.direccion}</span>
          </p>
          <p>
            <strong>Comuna:</strong> <span>{userProfile.comuna}</span>
          </p>
          <p>
            <strong>Correo:</strong> <span>{userProfile.correo}</span>
          </p>
          {userProfile.role !== "User" && (
            <p>
              <strong>Role:</strong> <span>{userProfile.role}</span>
            </p>
          )}
        </div>
        <div className="profile-buttons">
          <button
            className="profile-button"
            onClick={() => navigate("/diagnostic-records")}
          >
            <FaFileAlt className="button-icon" /> Historial de diagnosticos
          </button>
          <button
            className="profile-button"
            onClick={() =>
              navigate("/update-profile", { state: { userProfile } })
            } // Pass userProfile as state
          >
            <FaPen className="button-icon" /> Editar mi Información
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
