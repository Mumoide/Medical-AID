import React, { useEffect, useMemo, useState } from "react";
import { useTable, useFilters, useSortBy, usePagination } from "react-table";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import "./Users.css"; // Import the modern CSS styles

// Default filter input component
const DefaultColumnFilter = ({ column: { filterValue, setFilter } }) => (
  <input
    value={filterValue || ""}
    onChange={(e) => setFilter(e.target.value || undefined)}
    placeholder={`Search...`}
    style={{
      width: "100%",
      padding: "8px",
      borderRadius: "4px",
      border: "1px solid #e0e0e0",
    }}
  />
);

const Users = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch the user data from the backend
    fetch("http://localhost:3001/api/users/users")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Created At",
        accessor: "created_at",
        disableFilters: true, // Disable filters for this column
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Names",
        accessor: (row) => row.profile?.names || "N/A",
      },
      {
        Header: "Last Names",
        accessor: (row) => row.profile?.last_names || "N/A",
      },
      {
        Header: "Role",
        accessor: (row) =>
          row.roles.length > 0 ? row.roles[0].role.role_name : "N/A",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="icon-buttons">
            <FaEye />
            <FaEdit />
            <FaTrash />
          </div>
        ),
        disableFilters: true, // Disable filters for this column
      },
    ],
    []
  );

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
      data,
      defaultColumn: { Filter: DefaultColumnFilter }, // Set default filter UI
      initialState: { pageIndex: 0 }, // Start on page 0
    },
    useFilters, // Enable column filters
    useSortBy, // Enable sorting
    usePagination // Enable pagination
  );

  return (
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
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
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
  );
};

export default Users;
