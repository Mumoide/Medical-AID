import React, { useEffect, useState } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import MapView from "./MapView";
import "./DashboardView.css";

const DashboardView = () => {
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiagnosisData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/dashboard/all"
        );
        setDiagnosisData(response.data);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };
    fetchDiagnosisData();
  }, []);

  const columns = [
    { headerName: "ID Diagnosis", field: "id_diagnosis" },
    { headerName: "User ID", field: "id_user" },
    {
      headerName: "Diagnosis Date",
      field: "diagnosis_date",
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
    { headerName: "Latitude", field: "latitude" },
    { headerName: "Longitude", field: "longitude" },
    {
      headerName: "Probability",
      field: "probability",
      valueFormatter: (params) => `${params.value}%`,
    },
    {
      headerName: "Disease Name",
      field: "diseases",
      valueGetter: (params) =>
        params.data.diseases.map((d) => d.disease_name).join(", "),
    },
    {
      headerName: "Symptoms",
      field: "symptoms",
      valueGetter: (params) =>
        params.data.symptoms.map((s) => s.symptom_name).join(", "),
    },
  ];

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="dashboard-container">
      <h1>Diagnosis Dashboard</h1>
      <div className="map-container">
        <MapView /> {/* Render the MapView component */}
      </div>
      <div
        className="ag-theme-alpine"
        style={{ height: 400, width: "100%", marginTop: "20px" }}
      >
        <AgGridReact
          rowData={diagnosisData}
          columnDefs={columns}
          pagination={true}
          paginationPageSize={10}
        />
      </div>
    </div>
  );
};

export default DashboardView;
