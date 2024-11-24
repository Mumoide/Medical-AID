import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Swal from "sweetalert2";
import L from "leaflet";
import "./PublicAlertsPage.css"; // Add custom styles if needed
import { FaCheck, FaEyeSlash } from "react-icons/fa";

// Custom icon for the marker
const icon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [25, 25],
});

function PublicAlerts({ fetchAlerts }) {
  const [alertsData, setAlertsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const alertsPerPage = 5; // Number of alerts per page

  useEffect(() => {
    const fetchUserAlerts = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://localhost:3001/api/alerts/user-alerts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        let data = await response.json();
        console.log(data);
        // Sort data by updated_at in descending order
        data = data.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );

        setAlertsData(data);
      } catch (error) {
        Swal.fire(
          "Error",
          "No se han cargado alertas. Intente nuevamente.",
          "error"
        );
        console.error("Error fetching user alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAlerts();
  }, []);

  const updateAlertStatus = async (alertId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:3001/api/alerts/update-alert",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ alert_id: alertId }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const updatedAlert = await response.json();
      Swal.fire(
        "Actualizado",
        "La notificación fue actualizada correctamente",
        "success"
      );

      // Update the alert's readed value locally in the state
      setAlertsData((prevData) =>
        prevData.map((alert) =>
          alert.id_alert === alertId
            ? { ...alert, readed: updatedAlert.readed }
            : alert
        )
      );
      fetchAlerts();
    } catch (error) {
      Swal.fire(
        "Error",
        "Hubo un error al actualizar la notificación. Intente nuevamente.",
        "error"
      );
      console.error("Error updating alert status:", error);
    }
  };

  const updateAllAlertsStatus = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:3001/api/alerts/update-all-alerts",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const { readed } = await response.json();
      Swal.fire(
        "Actualización completada",
        "Todas las alertas se han marcado como leídas.",
        "success"
      );

      // Update all alerts' readed value locally in the state
      setAlertsData((prevData) =>
        prevData.map((alert) => ({ ...alert, readed }))
      );
      fetchAlerts();
    } catch (error) {
      Swal.fire(
        "Error",
        "Hubo un error al actualizar el estado de las alertas. Intente nuevamente",
        "error"
      );
      console.error("Error updating all alert statuses:", error);
    }
  };

  // Calculate paginated alerts
  const startIndex = (currentPage - 1) * alertsPerPage;
  const paginatedAlerts = alertsData.slice(
    startIndex,
    startIndex + alertsPerPage
  );

  // Calculate total pages
  const totalPages = Math.ceil(alertsData.length / alertsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Render loading state
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="public-alerts-view">
      <h2>Mis notificaciones</h2>
      <button
        className="update-all-alerts-button"
        onClick={updateAllAlertsStatus}
      >
        Marcar todo como leído
      </button>
      <div className="public-alerts-container">
        {paginatedAlerts.map((alert) => (
          <div key={alert.id_alert} className="public-alert-card">
            <div className="public-alert-info">
              <h3>{alert.title}</h3>
              <p>
                <strong>Severidad:</strong> {alert.alert_type}
              </p>
              <p>
                <strong>Descripción:</strong> {alert.description}
              </p>
              <p>
                <strong>Region:</strong> {alert.region}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(alert.created_at).toLocaleString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>
                <strong>Leído :</strong>{" "}
                {alert.readed ? (
                  <FaCheck className="public-alert-green" />
                ) : (
                  <FaEyeSlash className="public-alert-red" />
                )}
              </p>
              <button
                className="alert-status-button"
                onClick={() => updateAlertStatus(alert.id_alert)}
              >
                {alert.readed ? "Marcar no como leído" : "Marcar como leído"}
              </button>
            </div>
            <div className="public-alert-map">
              <MapContainer
                center={[alert.latitude, alert.longitude]}
                zoom={9}
                scrollWheelZoom={false}
                className="public-alert-map-container"
                dragging={false}
                doubleClickZoom={false}
                touchZoom={false}
                zoomControl={false}
                key={`${alert.latitude}-${alert.longitude}`} // Add unique key for each map instance
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={[alert.latitude, alert.longitude]}
                  icon={icon}
                />
              </MapContainer>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      <div className="alert-pagination-controls">
        <button
          className="alert-pagination-button"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="alert-pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="alert-pagination-button"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PublicAlerts;
