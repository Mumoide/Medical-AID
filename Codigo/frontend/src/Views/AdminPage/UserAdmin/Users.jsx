import React, { useEffect, useMemo, useState } from "react";
import { useTable, useFilters, useSortBy, usePagination } from "react-table";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaEye, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import "./Users.css";
import axios from "axios"; // Import axios for making the delete request
import { useWindowWidth } from "./useWindowWidth"; // Import the custom hook correctly
import Swal from "sweetalert2"; // Import SweetAlert

const Users = () => {
  const windowWidth = useWindowWidth(); // Get window width
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [roleFilter, setRoleFilter] = useState("User"); // State to filter by role

  useEffect(() => {
    // Fetch the user data from the backend
    fetch("http://localhost:3001/api/users/users")
      .then((response) => response.json())
      .then((data) => setData(data));
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
          await axios.delete(`http://localhost:3001/api/users/${id_user}`);

          // After successful deletion, refetch the user data to reflect changes
          const updatedData = await fetch(
            "http://localhost:3001/api/users/users"
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
            `http://localhost:3001/api/users/reactivate/${id_user}`
          );

          // Refetch the updated user data to reflect changes
          const updatedData = await fetch(
            "http://localhost:3001/api/users/users"
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

  // Apply the role filter based on the state
  const filteredData = useMemo(() => {
    if (!roleFilter) return data; // If no filter is applied, return all data
    return data.filter(
      (user) =>
        user.roles.length > 0 && user.roles[0].role.role_name === roleFilter
    );
  }, [data, roleFilter]);

  // Conditionally show/hide columns based on window width
  const columns = useMemo(() => {
    const baseColumns = [
      {
        Header: "Created At",
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
        Header: "Last Names",
        accessor: (row) => row.profile?.last_names || "N/A",
      });
    }

    // Only show Names if window width is greater than 1024px
    if (windowWidth > 1024) {
      baseColumns.push({
        Header: "Names",
        accessor: (row) => row.profile?.names || "N/A",
      });
    }

    // Only show the Active column if window width is greater than 1200px
    if (windowWidth > 768) {
      baseColumns.push({
        Header: "Active", // Display the 'Active' column
        accessor: "active", // This should match the key in your data
        Cell: ({ value }) => (value === true ? "Active" : "Inactive"), // Display 'Active' or 'Inactive'
      });
    }

    baseColumns.push({
      Header: "Actions",
      Cell: ({ row }) => (
        <div className="icon-buttons">
          <FaEye
            style={{ cursor: "pointer" }}
            onClick={() =>
              (window.location.href = `user/${row.original.id_user}`)
            }
          />
          <FaEdit
            style={{ cursor: "pointer" }}
            onClick={() =>
              (window.location.href = `updateuser/${row.original.id_user}`)
            }
          />
          {row.original.active ? (
            <FaTrash
              style={{ cursor: "pointer" }}
              onClick={() => handleDeleteUser(row.original.id_user)}
            />
          ) : (
            <FaCheck
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
        <button
          className="create-button"
          onClick={() => (window.location.href = "/admin/create")}
        >
          Crear nuevo usuario
        </button>
      </div>

      {/* Table container */}
      <div className="table-container">
        {/* Table */}
        <table {...getTableProps()}>
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

        {/* Pagination Controls */}
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

      <button onClick={handleBackClick} className="back-button">
        Volver
      </button>
    </div>
  );
};

export default Users;
