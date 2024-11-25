import React, { useEffect, useState, useMemo } from "react";
import { useTable } from "react-table";
import { useNavigate } from "react-router-dom";
import "./AlertsView.css"; // Add custom styles if needed
import Swal from "sweetalert2";
import { useWindowWidth } from "../../../utils/useWindowWidth"; // Import the custom hook
import { FaEye, FaEdit, FaTrash, FaCheck } from "react-icons/fa";

function AlertsView() {
  const [alertsData, setAlertsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const windowWidth = useWindowWidth(); // Get the window width
  const [nameFilter, setNameFilter] = useState(""); // Add name filter state
  const [startDate, setStartDate] = useState(""); // State for start date filter
  const [endDate, setEndDate] = useState(""); // State for end date filter
  const [inputStartDate, setInputStartDate] = useState("");
  const [inputEndDate, setInputEndDate] = useState("");

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(today.getDate()).padStart(2, "0");
  const formattedToday = `${year}-${month}-${day}`;

  // Fetch alerts data
  useEffect(() => {
    const fetchAlerts = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://localhost:3001/api/alerts/all-alerts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        setAlertsData(data);
      } catch (error) {
        Swal.fire("Error", "Failed to load alerts. Please try again.", "error");
        console.error("Error fetching alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const applyDateFilter = () => {
    const start = new Date(inputStartDate);
    const end = new Date(inputEndDate);
    const currentDate = new Date();

    if (end > currentDate) {
      Swal.fire({
        title: "Fecha fin inválida",
        text: "La fecha de fin no puede ser mayor a la fecha actual.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else if (start > end) {
      Swal.fire({
        title: "Rango de fecha inválido",
        text: "La fecha inical debe ser menor o igual a la fecha de fin..",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
      setStartDate(inputStartDate);
      setEndDate(inputEndDate);
    }
  };

  // Function to clear date filter
  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
    setInputStartDate("");
    setInputEndDate("");
    setNameFilter("");
  };

  const filteredData = useMemo(() => {
    if (!Array.isArray(alertsData)) return [];
    let filtered = alertsData;

    if (nameFilter) {
      const lowerCaseFilter = nameFilter.toLowerCase();
      filtered = filtered.filter((alert) => {
        const fullName = `${alert?.title || ""}`.toLowerCase();
        return fullName.includes(lowerCaseFilter);
      });
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      filtered = filtered.filter((alert) => {
        const createdAt = new Date(alert.created_at);
        return createdAt >= start && createdAt <= end;
      });
    }

    return filtered;
  }, [alertsData, nameFilter, startDate, endDate]);

  useEffect(() => {
    // Check if no data is found within the range and alert if empty

    if (filteredData.length === 0 && startDate && endDate) {
      clearDateFilter();
      Swal.fire({
        title: "No hay data",
        text: "No se encontraron usuarios dentro del rango de fechas indicado.",
        icon: "info",
        confirmButtonText: "OK",
      });
    }
  }, [filteredData, startDate, endDate]);

  // Define table columns
  const columns = useMemo(() => {
    const baseColumns = [
      {
        Header: "Título",
        accessor: "title", // Accesses `title` field
      },
      {
        Header: "Severidad",
        accessor: "alert_type", // Accesses `alert_type` field
      },
      {
        Header: "Región",
        accessor: "geoLocation.region", // Accesses nested `geoLocation.region` field
      },
    ];

    if (windowWidth > 1080) {
      baseColumns.splice(2, 0, {
        Header: "Descripción",
        accessor: "description", // Accesses `description` field
      });
    }

    if (windowWidth > 1080) {
      baseColumns.splice(0, 0, {
        Header: "ID",
        accessor: "id_alert", // Accesses `description` field
      });
    }

    if (windowWidth > 920) {
      baseColumns.push({
        Header: "Veces leído",
        accessor: "readed_count", // Accesses `readed_count` field
      });
    }

    if (windowWidth > 768) {
      baseColumns.push({
        Header: "Fecha creación",
        accessor: "created_at", // Accesses `created_at` field
        Cell: ({ value }) => {
          const date = new Date(value);
          return !isNaN(date)
            ? date.toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "Invalid Date";
        },
      });
    }

    baseColumns.push({
      Header: "Acciones",
      Cell: ({ row }) => (
        <div className="icon-buttons-alerts">
          <FaEye className="alert-blue" style={{ cursor: "pointer" }} />
          <FaEdit className="alert-green" style={{ cursor: "pointer" }} />
          <FaTrash className="alert-red" style={{ cursor: "pointer" }} />
        </div>
      ),
      disableFilters: true, // Disable filters for this column
    });
    return baseColumns;
  }, [windowWidth]);

  // Use React Table
  const tableInstance = useTable({ columns, data: filteredData });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  // Render loading state
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="alerts-view">
      <div className="alerts-admin-title">
        <h2>Administración de Alertas</h2>
      </div>
      <div className="filter-user-admin-container">
        {/* Name Filter Input */}
        <div className="filters-user-admin">
          <div className="name-filter">
            <label>Buscar por título</label>
            <input
              type="text"
              placeholder="Filtrar por nombre"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="name-filter-input"
            />
          </div>
          {/* Date Range Filter Inputs */}
          <div className="date-range-filter">
            <div className="date-range-filter-item">
              <div className="date-filter-user-admin">
                <div className="date-range-filter-item-label">
                  <label>Fecha de inicio</label>
                </div>
                <input
                  type="date"
                  value={inputStartDate}
                  onChange={(e) => setInputStartDate(e.target.value)}
                  className="date-input"
                  max={formattedToday}
                />
              </div>

              <div className="date-filter-user-admin">
                <div className="date-range-filter-item-label">
                  <label>Fecha fin</label>
                </div>
                <input
                  type="date"
                  value={inputEndDate}
                  onChange={(e) => setInputEndDate(e.target.value)}
                  className="date-input"
                  max={formattedToday}
                />
              </div>
            </div>
          </div>
          <div className="filter-buttons-user-admin">
            <button className="search-button" onClick={applyDateFilter}>
              Buscar
            </button>
            <button className="clear-button" onClick={clearDateFilter}>
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>
      <table {...getTableProps()} className="alerts-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Buttons for navigation */}
      <div className="button-container-alert-view">
        <button
          className="btn-alert-view create-alert-btn"
          onClick={() => navigate("/admin/create_alert")}
        >
          Crear Alerta
        </button>
        <button
          className="btn-alert-view go-back-btn"
          onClick={() => navigate(-1)}
        >
          Volver
        </button>
      </div>
    </div>
  );
}

export default AlertsView;
