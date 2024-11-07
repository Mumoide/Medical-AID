import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon } from "leaflet";
import "./MapView.css";

// Custom icon for markers with adjusted anchor
const customIcon = new Icon({
  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png", // Example icon
  iconSize: [25, 41],
  iconAnchor: [10, 10], // Adjust to center icon vertically and horizontally
  popupAnchor: [0, -20],
  shadowSize: [41, 41],
});

const MapView = () => {
  const [aggregatedData, setAggregatedData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiagnosisData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/dashboard/all"
        );

        // Aggregate data by disease name and location
        const groupedData = response.data.reduce((acc, diagnosis) => {
          diagnosis.diseases.forEach((disease) => {
            const key = `${disease.disease_name}-${diagnosis.latitude}-${diagnosis.longitude}`;
            if (!acc[key]) {
              acc[key] = {
                disease_name: disease.disease_name,
                latitude: diagnosis.latitude,
                longitude: diagnosis.longitude,
                count: 0,
              };
            }
            acc[key].count += 1;
          });
          return acc;
        }, {});

        // Convert groupedData to array
        setAggregatedData(Object.values(groupedData));
      } catch (err) {
        setError("Failed to fetch data");
      }
    };
    fetchDiagnosisData();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <MapContainer
      center={[-33.45, -70.65]}
      zoom={6}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <MarkerClusterGroup>
        {aggregatedData.map((data, index) => (
          <Marker
            key={index}
            position={[data.latitude, data.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div>
                <strong>Disease:</strong> {data.disease_name} <br />
                <strong>Cases:</strong> {data.count}
              </div>
            </Popup>

            <Circle
              center={[data.latitude, data.longitude]}
              radius={data.count * 50} // Scale circle size based on the count
              fillOpacity={0.3}
              color="blue"
            />
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapView;
