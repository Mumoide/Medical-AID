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

        // Transform data to disease granularity level
        const transformedData = response.data.flatMap((diagnosis) =>
          diagnosis.diseases.map((disease) => ({
            id_diagnosis: diagnosis.id_diagnosis,
            id_user: diagnosis.id_user,
            diagnosis_date: diagnosis.diagnosis_date,
            latitude: diagnosis.latitude,
            longitude: diagnosis.longitude,
            probability: diagnosis.probability,
            disease_name: disease.disease_name,
            symptoms: diagnosis.symptoms.map((s) => s.symptom_name).join(", "),
          }))
        );

        setDiagnosisData(transformedData);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };
    fetchDiagnosisData();
  }, []);

  const defaultColDef = {
    flex: 1, // Each column will take up an equal portion of the table width
    filter: "agTextColumnFilter",
    sortable: true,
    resizable: true,
  };

  const columns = [
    {
      headerName: "Diagnosis Date",
      field: "diagnosis_date",
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      headerName: "Probability",
      field: "probability",
      valueFormatter: (params) => `${params.value}%`,
    },
    {
      headerName: "Disease Name",
      field: "disease_name",
      filter: "agTextColumnFilter",

      filterParams: {
        maxNumConditions: 1,
        debounceMs: 200,
        trimInput: true,
        caseSensitive: false,
        textFormatter: (r) => {
          if (r == null) return null;
          return r
            .toLowerCase()
            .replace(/[àáâãäå]/g, "a")
            .replace(/æ/g, "ae")
            .replace(/ç/g, "c")
            .replace(/[èéêë]/g, "e")
            .replace(/[ìíîï]/g, "i")
            .replace(/ñ/g, "n")
            .replace(/[òóôõö]/g, "o")
            .replace(/œ/g, "oe")
            .replace(/[ùúûü]/g, "u")
            .replace(/[ýÿ]/g, "y");
        },
        filterOptions: ["contains"],
      },
    },
    {
      headerName: "Symptoms",
      field: "symptoms",
      filter: "agTextColumnFilter", // Enable text filter
      filterParams: {
        maxNumConditions: 1,
        filterOptions: ["contains"],
        debounceMs: 200,
        caseSensitive: false,
        defaultOption: "contains",
        textFormatter: (r) => {
          if (r == null) return null;
          return r
            .toLowerCase()
            .replace(/[àáâãäå]/g, "a")
            .replace(/æ/g, "ae")
            .replace(/ç/g, "c")
            .replace(/[èéêë]/g, "e")
            .replace(/[ìíîï]/g, "i")
            .replace(/ñ/g, "n")
            .replace(/[òóôõö]/g, "o")
            .replace(/œ/g, "oe")
            .replace(/[ùúûü]/g, "u")
            .replace(/[ýÿ]/g, "y");
        },
      },
    },
  ];

  const localeText = {
    // Common filter options
    contains: "Contiene",
    notContains: "No contiene",
    equals: "Igual a",
    notEqual: "No igual a",
    startsWith: "Empieza con",
    endsWith: "Termina con",
    // Buttons
    filterOoo: "Filtrar...",
    applyFilter: "Aplicar",
    clearFilter: "Limpiar",
    // Others as needed...
  };

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
          paginationPageSize={20}
          defaultColDef={defaultColDef}
          localeText={localeText}
        />
      </div>
    </div>
  );
};

export default DashboardView;
