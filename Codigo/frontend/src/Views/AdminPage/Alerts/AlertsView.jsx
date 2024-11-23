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
  const tableInstance = useTable({ columns, data: alertsData });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  // Render loading state
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="alerts-view">
      <h2>Administración de Alertas</h2>
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
