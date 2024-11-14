import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "./MapView.css";

const MapView = () => {
  const [aggregatedData, setAggregatedData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiagnosisData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/dashboard/all"
        );

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

  // Custom function to show the sum of cases within each cluster with variable size and color, in a circular shape
  const createClusterCustomIcon = (cluster) => {
    const markers = cluster.getAllChildMarkers();
    const totalCases = markers.reduce(
      (sum, marker) => sum + marker.options.data.count,
      0
    );

    // Define size scaling based on total cases (adjust as necessary)
    const size = Math.min(40 + totalCases * 0.5, 80); // Cap the size to 80px max

    // Define color scaling based on total cases (adjust thresholds as needed)
    let color;
    if (totalCases < 10) {
      color = "#81C784"; // Green for low emergency (few cases)
    } else if (totalCases < 50) {
      color = "#c4b532"; // Yellow for moderate emergency
    } else if (totalCases < 100) {
      color = "#dc8b14"; // Orange for high emergency
    } else {
      color = "#cf2c28"; // Red for critical emergency (many cases)
    }

    return L.divIcon({
      html: `<div style="background-color:${color}; width:${size}px; height:${size}px; line-height:${size}px; border-radius: 50%;"><span>${totalCases}</span></div>`,
      className: "custom-cluster-icon",
      iconSize: L.point(size, size),
    });
  };

  return (
    <MapContainer
      center={[-33.15, -71.65]} // Coordenadas de Santiago, Chile
      zoom={6}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=gTDLDNUoGR19LT9Rp1mCvefJcSDkiUdTcwlB5FjiPOuKcpROoTajRbrbD1tfvw0g"
        attribution='<a href="https://www.jawg.io?utm_medium=map&utm_source=attribution" target="_blank">&copy; Jawg</a> - <a href="https://www.openstreetmap.org?utm_medium=map-attribution&utm_source=jawg" target="_blank">&copy; OpenStreetMap</a> contributors'
        detectRetina={true} // Enables retina-quality tiles on high-DPI screens
        maxZoom={18}
        minZoom={0}
      />

      <MarkerClusterGroup iconCreateFunction={createClusterCustomIcon}>
        {aggregatedData.map((data, index) => (
          <CircleMarker
            key={index}
            center={[data.latitude, data.longitude]}
            radius={Math.sqrt(data.count) * 5} // Adjust radius based on count
            fillOpacity={0.3}
            color="blue"
            data={data} // Pass the data to each marker
          >
            <Popup>
              <div>
                <strong>Disease:</strong> {data.disease_name} <br />
                <strong>Cases:</strong> {data.count}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapView;
