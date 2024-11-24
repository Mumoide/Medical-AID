import React, { useEffect, useMemo, useState } from "react";
import { useTable, useFilters, useSortBy, usePagination } from "react-table";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaEye, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import "./Users.css";
import axios from "axios"; // Import axios for making the delete request
import { useWindowWidth } from "../../../utils/useWindowWidth"; // Import the custom hook correctly
import Swal from "sweetalert2"; // Import SweetAlert

const Users = () => {
  const windowWidth = useWindowWidth(); // Get window width
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [roleFilter, setRoleFilter] = useState("User"); // State to filter by role
  const [nameFilter, setNameFilter] = useState(""); // Add name filter state
  const [startDate, setStartDate] = useState(""); // State for start date filter
  const [endDate, setEndDate] = useState(""); // State for end date filter
  const [inputStartDate, setInputStartDate] = useState("");
  const [inputEndDate, setInputEndDate] = useState("");

  // Get today's date in YYYY-MM-DD format
  // Get today's date in YYYY-MM-DD format, adjusted for local timezone
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(today.getDate()).padStart(2, "0");
  const formattedToday = `${year}-${month}-${day}`;

  useEffect(() => {
    // Fetch the user data from the backend
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/users/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token from storage
          },
        });

        if (response.status === 403) {
          // Token is invalid or expired
          Swal.fire({
            title: "Session Expired",
            text: "Please log in again.",
            icon: "warning",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              // Redirect to login after the alert is confirmed/closed
              localStorage.removeItem("token");
              window.location.href = "/inicio-de-sesion";
            }
          });
          return;
        } else if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        Swal.fire({
          title: "Error",
          text: "An error occurred. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchUserData();
  }, []);

  // Back button click handler to navigate back to /form
  const handleBackClick = () => {
    navigate("/admin");
  };

  // Function to handle deleting a user (logical delete, updating 'active' field)
  const handleDeleteUser = async (id_user) => {
    // Show SweetAlert confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "This action will deactivate the user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, deactivate it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Send DELETE request to the backend (logical delete)
          await axios.delete(`http://localhost:3001/api/users/${id_user}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token from storage
            },
          });

          // After successful deletion, refetch the user data to reflect changes
          const updatedData = await fetch(
            "http://localhost:3001/api/users/users",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token from storage
              },
            }
          )
            .then((response) => response.json())
            .catch((error) => {
              console.error("Error fetching updated data:", error);
              throw error;
            });

          // Update the table with the refreshed data
          setData(updatedData);

          // Show a success notification
          Swal.fire(
            "Deactivated!",
            "The user has been deactivated.",
            "success"
          );
        } catch (error) {
          console.error("Error deactivating user:", error);
          Swal.fire("Error!", "Failed to deactivate the user.", "error");
        }
      }
    });
  };

  // Function to handle reactivating a user
  const handleReactivateUser = async (id_user) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will reactivate the user.",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reactivate it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Send PUT request to reactivate the user
          await axios.put(
            `http://localhost:3001/api/users/reactivate/${id_user}`,
            {}, // Empty body for PUT request
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is set correctly
              },
            }
          );

          // Refetch the updated user data to reflect changes
          const updatedData = await fetch(
            "http://localhost:3001/api/users/users",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token from storage
              },
            }
          )
            .then((response) => response.json())
            .catch((error) => {
              console.error("Error fetching updated data:", error);
              throw error;
            });

          setData(updatedData);

          // Show success message
          Swal.fire(
            "Reactivated!",
            "The user has been reactivated.",
            "success"
          );
        } catch (error) {
          console.error("Error reactivating user:", error);
          Swal.fire("Error!", "Failed to reactivate the user.", "error");
        }
      }
    });
  };

  // Function to handle applying the date filter
  const applyDateFilter = () => {
    const start = new Date(inputStartDate);
    const end = new Date(inputEndDate);
    const currentDate = new Date();

    if (end > currentDate) {
      Swal.fire({
        title: "Invalid End Date",
        text: "End date cannot be greater than the current date.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else if (start > end) {
      Swal.fire({
        title: "Invalid Date Range",
        text: "Start date must be before or equal to end date.",
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
    if (!Array.isArray(data)) return [];
    let filtered = data;

    if (roleFilter) {
      filtered = filtered.filter(
        (user) =>
          user.roles.length > 0 && user.roles[0].role.role_name === roleFilter
      );
    }

    if (nameFilter) {
      const lowerCaseFilter = nameFilter.toLowerCase();
      filtered = filtered.filter((user) => {
        const fullName = `${user.profile?.names || ""} ${
          user.profile?.last_names || ""
        }`.toLowerCase();
        return fullName.includes(lowerCaseFilter);
      });
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      filtered = filtered.filter((user) => {
        const createdAt = new Date(user.created_at);
        return createdAt >= start && createdAt <= end;
      });
    }

    return filtered;
  }, [data, roleFilter, nameFilter, startDate, endDate]);

  useEffect(() => {
    // Check if no data is found within the range and alert if empty
    if (filteredData.length === 0 && startDate && endDate) {
      Swal.fire({
        title: "No Data Found",
        text: "No users found within the selected date range.",
        icon: "info",
        confirmButtonText: "OK",
      });
    }
  }, [filteredData, startDate, endDate]);

  // Conditionally show/hide columns based on window width
  const columns = useMemo(() => {
    const baseColumns = [
      {
        Header: "Fecha de Creación",
        accessor: "created_at",
        disableFilters: true, // Disable filters for this column
        Cell: ({ value }) => {
          // Parse and format the date
          const date = new Date(value);
          const formattedDate = `${date.getHours()}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")} ${date.getDate()}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`;
          return formattedDate;
        },
      },
      {
        Header: "Email",
        accessor: "email",
      },
    ];

    // Only show Last Names if window width is greater than 768px
    if (windowWidth > 1200) {
      baseColumns.push({
        Header: "Apellidos",
        accessor: (row) => row.profile?.last_names || "N/A",
      });
    }

    // Only show Names if window width is greater than 1024px
    if (windowWidth > 1024) {
      baseColumns.push({
        Header: "Nombres",
        accessor: (row) => row.profile?.names || "N/A",
      });
    }

    // Only show the Active column if window width is greater than 1200px
    if (windowWidth > 768) {
      baseColumns.push({
        Header: "Activo", // Display the 'Active' column
        accessor: "active", // This should match the key in your data
        Cell: ({ value }) => (value === true ? "Active" : "Inactive"), // Display 'Active' or 'Inactive'
      });
    }

    baseColumns.push({
      Header: "Acciones",
      Cell: ({ row }) => (
        <div className="icon-buttons-users-admin">
          <FaEye
            className="user-admin-blue"
            style={{ cursor: "pointer" }}
            onClick={() =>
              (window.location.href = `user/${row.original.id_user}`)
            }
          />
          <FaEdit
            className="user-admin-green"
            style={{ cursor: "pointer" }}
            onClick={() =>
              (window.location.href = `updateuser/${row.original.id_user}`)
            }
          />
          {row.original.active ? (
            <FaTrash
              className="user-admin-red"
              style={{ cursor: "pointer" }}
              onClick={() => handleDeleteUser(row.original.id_user)}
            />
          ) : (
            <FaCheck
              className="user-admin-green"
              style={{ cursor: "pointer" }}
              onClick={() => handleReactivateUser(row.original.id_user)}
            />
          )}
        </div>
      ),
      disableFilters: true, // Disable filters for this column
    });

    return baseColumns;
  }, [windowWidth]);

  // Use the react-table hooks
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setPageSize,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: filteredData, // Use the filtered data instead of the original
      initialState: { pageIndex: 0 }, // Start on page 0
    },
    useFilters, // Enable column filters
    useSortBy, // Enable sorting
    usePagination // Enable pagination
  );

  return (
    <div>
      {/* Role Filter Buttons outside of table-container */}
      <div className="user-admincontainer">
        <div className="filter-user-admin-container">
          <div className="top-buttons-admin">
            <div className="role-filter-buttons">
              <button
                className={roleFilter === "User" ? "active" : ""}
                onClick={() => setRoleFilter("User")}
              >
                Filtrar por usuario
              </button>
              <button
                className={roleFilter === "Admin" ? "active" : ""}
                onClick={() => setRoleFilter("Admin")}
              >
                Filtrar por administrador
              </button>
            </div>
            <button
              className="create-button-admin"
              onClick={() => (window.location.href = "/admin/create")}
            >
              Crear nuevo usuario
            </button>
          </div>

          {/* Name Filter Input */}
<div className="filters-user-admin">
          <div className="name-filter">
            <label>Buscar por nombre</label>
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
        {/* Table container */}
        <div className="table-container">
          {/* Table */}
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => {
                const { key, ...headerGroupProps } =
                headerGroup.getHeaderGroupProps(); // Extract key for <tr>
                return (
                  <tr key={key} {...headerGroupProps}>
                    {headerGroup.headers.map((column) => {
                      const { key: headerKey, ...headerProps } =
                        column.getHeaderProps(column.getSortByToggleProps()); // Extract key for <th>
                      return (
                        <th key={headerKey} {...headerProps}>
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                );
              })}
            </thead>

            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                const { key, ...rowProps } = row.getRowProps(); // Extract key for <tr>
                return (
                  <tr key={key} {...rowProps}>
                    {row.cells.map((cell) => {
                      const { key: cellKey, ...cellProps } =
                        cell.getCellProps(); // Extract key for <td>
                      return (
                        <td key={cellKey} {...cellProps}>
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination Controls */}
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
        </div>

        <button onClick={handleBackClick} className="back-button">
          Volver
        </button>
      </div>
    </div>
  );
};

export default Users;
