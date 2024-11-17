import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./AlertsView.css"; // Custom CSS for styling
import Swal from "sweetalert2";
import axios from "axios";

// Initial icon setup for Leaflet (Optional customization)
const markerIcon = new L.Icon({
  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://leafletjs.com/examples/custom-icons/leaf-shadow.png",
  shadowSize: [41, 41],
});

function AlertsView() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    alertType: "Grave",
    region: "Metropolitana",
  });

  const [selectedLocation, setSelectedLocation] = useState({
    lat: -33.46,
    lng: -70.65,
  });

  const allowedAlertTypes = ["Grave", "Moderada", "Leve"];
  const allowedRegions = [
    "Arica-Parinacota",
    "Tarapacá",
    "Antofagasta",
    "Atacama",
    "Coquimbo",
    "Valparaíso",
    "Metropolitana",
    "O'Higgins",
    "Maule",
    "Ñuble",
    "Bío Bío",
    "Araucanía",
    "Los Ríos",
    "Los Lagos",
    "Aysén",
    "Magallanes y Antártica Chilena",
    "Todas las regiones",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    // Title validation
    if (!formData.title || formData.title.length > 50) {
      Swal.fire({
        icon: "error",
        title: "Invalid Title",
        text: "Title is required and must not exceed 50 characters.",
      });
      return false;
    }

    // Description validation
    if (!formData.description || formData.description.length > 255) {
      Swal.fire({
        icon: "error",
        title: "Invalid Description",
        text: "Description is required and must not exceed 255 characters.",
      });
      return false;
    }

    // Alert type validation
    if (!allowedAlertTypes.includes(formData.alertType)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Alert Type",
        text: "Alert type must be one of Grave, Moderada, or Leve.",
      });
      return false;
    }

    // Region validation
    if (!allowedRegions.includes(formData.region)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Region",
        text: "Please select a valid region.",
      });
      return false;
    }

    // Latitude and longitude validation
    const isValidCoordinate = (coord) => /^-?\d+(\.\d+)?$/.test(coord);
    if (
      !isValidCoordinate(selectedLocation.lat) ||
      selectedLocation.lat < -90 ||
      selectedLocation.lat > 90
    ) {
      Swal.fire({
        icon: "error",
        title: "Invalid Latitude",
        text: "Latitude must be a number between -90 and 90.",
      });
      return false;
    }
    if (
      !isValidCoordinate(selectedLocation.lng) ||
      selectedLocation.lng < -180 ||
      selectedLocation.lng > 180
    ) {
      Swal.fire({
        icon: "error",
        title: "Invalid Longitude",
        text: "Longitude must be a number between -180 and 180.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "http://localhost:3001/api/alerts/create",
        {
          title: formData.title,
          description: formData.description,
          alert_type: formData.alertType,
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
          region: formData.region,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token from storage
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Alert Created",
        text: response.data.message,
      });

      setFormData({
        title: "",
        description: "",
        alertType: "Grave",
        region: "Metropolitana",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error Creating Alert",
        text:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
      });
    }
  };

  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        setSelectedLocation({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      },
    });
    return null;
  };

  useEffect(() => {
    console.log(selectedLocation);
  }, [selectedLocation]);

  return (
    <div className="alerts-container">
      <form className="alert-form" onSubmit={handleSubmit}>
        <h2>Manage Alert</h2>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Alert Type:
          <select
            name="alertType"
            value={formData.alertType}
            onChange={handleChange}
          >
            <option value="Grave">Grave</option>
            <option value="Moderada">Moderada</option>
            <option value="Leve">Leve</option>
          </select>
        </label>
        <label>
          Region:
          <select name="region" value={formData.region} onChange={handleChange}>
            {allowedRegions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Submit Alert</button>
      </form>

      <div className="map-container">
        <label>Seleccione ubicación:</label>
        <MapContainer
          center={[selectedLocation.lat, selectedLocation.lng]}
          zoom={8}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={markerIcon}
          />
          <LocationSelector />
        </MapContainer>
      </div>
    </div>
  );
}

export default AlertsView;
