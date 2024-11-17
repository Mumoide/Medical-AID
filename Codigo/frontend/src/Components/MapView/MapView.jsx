import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import "./MapView.css";

const MapView = ({ filteredData = [] }) => {
  console.log("MapView", filteredData);

  return (
    <MapContainer
      center={[-33.46, -70.65]}
      zoom={6}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=gTDLDNUoGR19LT9Rp1mCvefJcSDkiUdTcwlB5FjiPOuKcpROoTajRbrbD1tfvw0g"
        attribution='<a href="https://www.jawg.io?utm_medium=map&utm_source=attribution" target="_blank">&copy; Jawg</a> - <a href="https://www.openstreetmap.org?utm_medium=map-attribution&utm_source=jawg" target="_blank">&copy; OpenStreetMap</a> contributors'
        detectRetina={true}
        maxZoom={18}
        minZoom={0}
      />

      <MarkerClusterGroup>
        {filteredData.length > 0 &&
          filteredData.map((data, index) => (
            <CircleMarker
              key={index}
              center={[data.latitude, data.longitude]}
              radius={8}
              fillOpacity={0.6}
              color="blue"
            >
              <Popup>
                <div>
                  <strong>Disease:</strong> {data.disease_name} <br />
                  <strong>Probability:</strong> {data.probability}%
                </div>
              </Popup>
            </CircleMarker>
          ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapView;
