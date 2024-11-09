import React, { useEffect, useMemo, useState } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import Swal from "sweetalert2"; // Import SweetAlert for alerts
import "./DiagnosticRecordsPage.css"; // Add CSS for styling if needed

const DiagnosticRecordsPage = () => {
  const [data, setData] = useState([]);
  const userId = localStorage.getItem("user_id");

  const formatSymptomName = (symptomName) => {
    let formattedName = symptomName.replace(/_/g, " ");
    return (
      formattedName.charAt(0).toUpperCase() +
      formattedName.slice(1).toLowerCase()
    );
  };

  useEffect(() => {
    // Fetch diagnostic records for the logged-in user
    const fetchDiagnosticRecords = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/diagnosis/diagnostic-records/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token in request
            },
          }
        );

        if (response.status === 403) {
          // Handle token expiration
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
        } else if (!response.ok) {
          throw new Error("Failed to fetch diagnostic records");
        }

        let data = await response.json();

        // Filter out records with empty disease names
        data = data.filter((record) =>
          record.diseases.some((disease) => disease.disease_name)
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
  }, [userId]);

  // Define columns for the table
  const columns = useMemo(
    () => [
      {
        Header: "Diagnosis Date",
        accessor: "diagnosis_date",
        Cell: ({ value }) => {
          const date = new Date(value);
          return `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`;
        },
      },
      {
        Header: "Diseases",
        accessor: "diseases",
        Cell: ({ value }) =>
          value.map((disease) => disease.disease_name).join(", "),
      },
      {
        Header: "Symptoms",
        accessor: "symptoms",
        Cell: ({ value }) =>
          value
            .map((symptom) => formatSymptomName(symptom.symptom_name))
            .join(", "),
      },
    ],
    []
  );

  // Set up table instance with react-table hooks
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
      data,
      initialState: { pageIndex: 0 }, // Start on the first page
    },
    useSortBy, // Enable sorting
    usePagination // Enable pagination
  );

  return (
    <div className="diagnostic-records-page">
      <h1>Diagnostic Records</h1>
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
          Previous
        </button>
        <span>
          Page <strong>{pageIndex + 1}</strong>
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DiagnosticRecordsPage;
