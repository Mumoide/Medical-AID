import React, { useEffect, useMemo, useState } from "react";
import { useTable, useFilters, useSortBy, usePagination } from "react-table";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import "./Users.css";
import { useWindowWidth } from "./useWindowWidth"; // Import the custom hook correctly

const Users = () => {
  const [data, setData] = useState([]);
  const [roleFilter, setRoleFilter] = useState(""); // State to filter by role
  const windowWidth = useWindowWidth(); // Get window width

  useEffect(() => {
    // Fetch the user data from the backend
    fetch("http://localhost:3001/api/users/users")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

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
    if (windowWidth > 1024) {
      baseColumns.push({
        Header: "Last Names",
        accessor: (row) => row.profile?.last_names || "N/A",
      });
    }

    // Only show Names if window width is greater than 1024px
    if (windowWidth > 768) {
      baseColumns.push({
        Header: "Names",
        accessor: (row) => row.profile?.names || "N/A",
      });
    }

    // Only show Role if window width is greater than 1200px
    if (windowWidth > 1200) {
      baseColumns.push({
        Header: "Role",
        accessor: (row) =>
          row.roles.length > 0 ? row.roles[0].role.role_name : "N/A",
      });
    }

    baseColumns.push({
      Header: "Actions",
      Cell: ({ row }) => (
        <div className="icon-buttons">
          <FaEye />
          <FaEdit />
          <FaTrash />
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
          Filter by User
        </button>
        <button
          className={roleFilter === "Admin" ? "active" : ""}
          onClick={() => setRoleFilter("Admin")}
        >
          Filter by Admin
        </button>
        <button
          className="create-button"
          onClick={() => (window.location.href = "/admin/create")}
        >
          Create New User
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
    </div>
  );
};

export default Users;
