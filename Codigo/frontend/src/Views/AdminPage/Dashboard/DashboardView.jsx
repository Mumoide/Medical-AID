import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Bar, Pie } from "react-chartjs-2"; // Import Bar chart from react-chartjs-2
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Swal from "sweetalert2"; // Import SweetAlert2
import MapView from "../../../Components/MapView/MapView";
import "./DashboardView.css";

const DashboardView = () => {
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [error, setError] = useState(null);

  // States for date filter
  const [filteredData, setFilteredData] = useState([]);
  const [inputStartDate, setInputStartDate] = useState("");
  const [inputEndDate, setInputEndDate] = useState("");

  // Disable future dates
  const today = new Date().toISOString().split("T")[0];

  const navigate = useNavigate();

  const formatText = (text) =>
    text
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/^\w/, (char) => char.toUpperCase());

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
            symptoms: diagnosis.symptoms
              .map((s) => formatText(s.symptom_name))
              .join(", "),
          }))
        );

        setDiagnosisData(transformedData);
        setFilteredData(transformedData);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };
    fetchDiagnosisData();
  }, []);

  const validateDates = () => {
    // Check if start date is after end date or vice versa
    if (inputStartDate && inputEndDate) {
      if (inputStartDate > inputEndDate) {
        Swal.fire({
          icon: "error",
          title: "Rangos de fecha inválidos",
          text: "La fecha de inicio no puede ser mayor a la fecha fin.",
        });
        return false;
      } else if (inputEndDate < inputStartDate) {
        Swal.fire({
          icon: "error",
          title: "Rangos de fecha inválidos",
          text: "La fecha de fin no puede ser mayor a la fecha de inicio.",
        });
        return false;
      }
    }
    return true;
  };

  const applyFilters = () => {
    if (!validateDates()) return;

    const filtered = diagnosisData.filter((item) => {
      const diagnosisDate = new Date(item.diagnosis_date)
        .toISOString()
        .split("T")[0];
      const withinStartDate = inputStartDate
        ? diagnosisDate >= inputStartDate
        : true;
      const withinEndDate = inputEndDate ? diagnosisDate <= inputEndDate : true;
      return withinStartDate && withinEndDate;
    });

    // If no data found, reset filters and show alert
    if (filtered.length === 0) {
      clearFilters();
      Swal.fire({
        icon: "warning",
        title: "Sin Data",
        text: "No se encuentra data en los rangos de fehca seleccionados. Los filtros han sido reestablecidos.",
      });
    } else {
      setFilteredData(filtered);
    }
  };

  const clearFilters = () => {
    setInputStartDate("");
    setInputEndDate("");
    setFilteredData(diagnosisData);
  };

  const handleSearch = () => {
    applyFilters();
  };

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

  // Calculate the top 5 most common diseases for the bar chart
  const diseaseCounts = filteredData.reduce((acc, diagnosis) => {
    acc[diagnosis.disease_name] = (acc[diagnosis.disease_name] || 0) + 1;
    return acc;
  }, {});

  const sortedDiseases = Object.entries(diseaseCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const barChartData = {
    labels: sortedDiseases.map(([disease]) => disease),
    datasets: [
      {
        label: "Number of Diagnoses",
        data: sortedDiseases.map(([, count]) => count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // Calculate the top 8 symptoms for the pie chart
  const symptomCounts = filteredData.reduce((acc, diagnosis) => {
    diagnosis.symptoms.split(", ").forEach((symptom) => {
      acc[symptom] = (acc[symptom] || 0) + 1;
    });
    return acc;
  }, {});

  const sortedSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const totalSymptoms = sortedSymptoms.reduce(
    (sum, [, count]) => sum + count,
    0
  );

  const pieChartData = {
    labels: sortedSymptoms.map(([symptom]) => symptom),
    datasets: [
      {
        label: "Symptom Distribution",
        data: sortedSymptoms.map(([, count]) => count),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#C9CBCF",
          "#FF5733",
        ],
      },
    ],
  };

  const pieChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true, // Enable the traditional legend
        position: "left", // Position the legend to the left of the chart
        labels: {
          boxWidth: 15, // Adjust box size if needed
          padding: 8, // Add padding around legend items
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw;
            const percentage = ((value / totalSymptoms) * 100).toFixed(2);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        display: true, // Always display labels on the slices
        color: "#ffffff", // Label color
        formatter: (value, context) => {
          const percentage = ((value / totalSymptoms) * 100).toFixed(1);
          return `${percentage}%`;
        },
        font: {
          weight: "bold",
          size: 12, // Adjust size as needed
        },
        anchor: "center",
        align: "center",
        padding: 6,
        borderRadius: 4,
        backgroundColor: (context) =>
          context.dataset.backgroundColor[context.dataIndex],
      },
    },
  };

  // Indicators calculations
  const uniqueDiagnoses = new Set(filteredData.map((item) => item.id_diagnosis))
    .size;
  const totalSymptomsIndicator = filteredData.reduce(
    (acc, item) => acc + item.symptoms.split(", ").length,
    0
  );
  const averageProbability = (
    filteredData.reduce((acc, item) => acc + item.probability, 0) /
    filteredData.length
  ).toFixed(2);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="dashboard-container">
      {/* Map Section */}
      <div className="map-section-admin">
        <h1>Diagnosis Dashboard</h1>
        <div className="map-container">
          <MapView filteredData={filteredData} />
          {/* Pass filteredData to MapView as data prop */}
        </div>
        <div className="dashboard-alert-button-admin-container">
          <button
            className="dashboard-alert-button-admin"
            onClick={() => navigate("/admin/create_alert")}
          >
            Crear Alerta
          </button>
        </div>
      </div>

      {/* Indicators Section */}
      <div className="indicators">
        <div className="indicator">
          <strong>Diagnósticos de usuarios:</strong> {uniqueDiagnoses}
        </div>
        <div className="indicator">
          <strong>Síntomas ingresados:</strong> {totalSymptomsIndicator}
        </div>
        <div className="indicator">
          <strong>Probabilidad promedio:</strong> {averageProbability}%
        </div>
      </div>
      {/* Date Filter Section */}
      <div className="filter-section-admin">
        <div className="filter-section-admin-item">
          <label>Fecha inicial:</label>
          <input
            type="date"
            value={inputStartDate}
            onChange={(e) => setInputStartDate(e.target.value)}
            max={today} // Disable future dates
            className="date-input-admin"
          />
          <label>Fecha final:</label>
          <input
            type="date"
            value={inputEndDate}
            onChange={(e) => setInputEndDate(e.target.value)}
            max={today} // Disable future dates
            className="date-input-admin"
          />
        </div>
        <div className="filter-section-admin-item">
          <button className="search-button-dashboard" onClick={handleSearch}>
            Buscar
          </button>
          <button className="clear-button-dashboard" onClick={clearFilters}>
            Limpiar filtros
          </button>
        </div>
      </div>

      <div className="chart-grid">
        {/* Bar chart container */}
        <div className="chart-item">
          <h2>Top 5 Diagnósticos</h2>
          <div className="chart-container">
            <Bar data={barChartData} />
          </div>
        </div>

        {/* Pie chart container */}
        <div className="chart-item">
          <h2>Top 8 Síntomas</h2>
          <div className="chart-container">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
      </div>

      {/* Summary table container */}
      <div className="table-section-admin">
        <h2>Tabla resumen</h2>
        <div
          className="ag-theme-alpine"
          style={{ height: 400, width: "100%", marginTop: "20px" }}
        >
          <AgGridReact
            rowData={filteredData}
            columnDefs={columns}
            pagination={true}
            paginationPageSize={20}
            defaultColDef={defaultColDef}
            localeText={localeText}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
