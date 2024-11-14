import React, { useEffect, useMemo, useState } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa"; // Import the eye icon
import Swal from "sweetalert2";
import "./DiagnosticRecordsPage.css";

const DiagnosticRecordsPage = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [diseaseNameFilter, setDiseaseNameFilter] = useState(""); // Filter by name
  const [startDiagnosisDate, setStartDiagnosisDate] = useState(""); // Start date filter
  const [endDiagnosisDate, setEndDiagnosisDate] = useState(""); // End date filter
  const [inputStartDate, setInputStartDate] = useState(""); // Input for start date
  const [inputEndDate, setInputEndDate] = useState(""); // Input for end date
  const userId = localStorage.getItem("user_id");

  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(today.getDate()).padStart(2, "0");
  const formattedToday = `${year}-${month}-${day}`;

  useEffect(() => {
    const fetchDiagnosticRecords = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/diagnosis/diagnostic-records/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 403) {
          Swal.fire({
            title: "Session Expired",
            text: "Please log in again.",
            icon: "warning",
            confirmButtonText: "OK",
          }).then(() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          });
          return;
        } else if (!response.ok)
          throw new Error("Failed to fetch diagnostic records");

        let data = await response.json();

        // Flatten data so each disease has its own row
        data = data
          .filter((record) => record.diseases.some((d) => d.disease_name))
          .flatMap((record) =>
            record.diseases.map((disease) => ({
              diagnosis_date: record.diagnosis_date,
              disease_name: disease.disease_name,
              symptoms: record.symptoms,
            }))
          );

        setData(data);
      } catch (error) {
        console.error("Error fetching diagnostic records:", error);
        Swal.fire({
          title: "Error",
          text: "An error occurred while fetching diagnostic records.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchDiagnosticRecords();
  }, []);

  // Apply filters based on name and date range
  const applyFilters = () => {
    setStartDiagnosisDate(inputStartDate);
    setEndDiagnosisDate(inputEndDate);
  };

  // Clear filters and reset input fields
  const clearFilters = () => {
    setDiseaseNameFilter("");
    setStartDiagnosisDate("");
    setEndDiagnosisDate("");
    setInputStartDate("");
    setInputEndDate("");
  };

  const filteredData = useMemo(() => {
    console.log(data);
    return data.filter((disease) => {
      const matchesName = disease.disease_name
        .toLowerCase()
        .includes(diseaseNameFilter.toLowerCase());

      // Convert diagnosis_date to YYYY-MM-DD format
      const diagnosisDate = new Date(disease.diagnosis_date)
        .toISOString()
        .split("T")[0];
      const startDate = startDiagnosisDate ? startDiagnosisDate : null;
      const endDate = endDiagnosisDate ? endDiagnosisDate : null;

      // Check if diagnosisDate is within the date range, inclusive
      const withinDateRange =
        (!startDate || diagnosisDate >= startDate) &&
        (!endDate || diagnosisDate <= endDate);

      return matchesName && withinDateRange;
    });
  }, [data, diseaseNameFilter, startDiagnosisDate, endDiagnosisDate]);

  useEffect(() => {
    if (filteredData.length === 0 && (startDiagnosisDate || endDiagnosisDate)) {
      Swal.fire({
        title: "No Data Found",
        text: "No diseases found within the selected filters.",
        icon: "info",
        confirmButtonText: "OK",
      });
    }
  }, [filteredData, startDiagnosisDate, endDiagnosisDate]);

  const columns = useMemo(
    () => [
      {
        Header: "Fecha",
        accessor: "diagnosis_date",
        Cell: ({ value }) => {
          const date = new Date(value);
          return `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`;
        },
      },
      {
        Header: "Diagnóstico",
        accessor: "disease_name",
      },
      {
        Header: "Síntomas",
        accessor: "symptoms",
        Cell: ({ value }) =>
          value
            .map((symptom) => symptom.symptom_name.replace(/_/g, " "))
            .join(", "),
      },
      {
        Header: "Acciones",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="icon-buttons-register">
            <FaEye
              onClick={() =>
                navigate("/disease", {
                  state: { disease_name: row.original.disease_name },
                })
              }
            />
          </div>
        ),
      },
    ],
    [navigate]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    state: { pageIndex },
    prepareRow,
    setPageSize,
    state: { pageSize },
  } = useTable(
    {
      columns,
      data: filteredData, // Apply filtered data here
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="diagnostic-records-page">
      <h1>Historial de Diagnósticos</h1>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="name-filter">
          <label>Buscar por nombre:</label>
          <input
            type="text"
            placeholder="Filtrar por diagnóstico"
            value={diseaseNameFilter}
            onChange={(e) => setDiseaseNameFilter(e.target.value)}
            className="name-filter-input"
          />
        </div>
        <div className="date-range-filter">
          <label>Fecha de inicio:</label>
          <input
            type="date"
            value={inputStartDate}
            onChange={(e) => setInputStartDate(e.target.value)}
            max={formattedToday}
          />
          <label>Fecha fin:</label>
          <input
            type="date"
            value={inputEndDate}
            onChange={(e) => setInputEndDate(e.target.value)}
            max={formattedToday}
          />
          <button className="search-button" onClick={applyFilters}>
            Search
          </button>
          <button className="clear-button" onClick={clearFilters}>
            Clear Filter
          </button>
        </div>
      </div>

      {/* Diagnostic Table */}
      <table {...getTableProps()} className="diagnostic-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
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

      {/* Pagination controls */}
      <div className="pagination">
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Anterior
        </button>
        <span>
          Página <strong>{pageIndex + 1}</strong>
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Siguiente
        </button>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              Mostrar {size}
            </option>
          ))}
        </select>
      </div>

      <button onClick={() => navigate(-1)} className="back-button-records">
        Volver
      </button>
    </div>
  );
};

export default DiagnosticRecordsPage;
