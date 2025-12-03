import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Checkbox,
  Box,
} from "@mui/material";
import "./CustomizedTable.css";

const CustomizedTable = ({
  columns = [],
  data = [],
  total = 0,
  fetchData,       
  onSelectRows,
}) => {
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ orderBy: null, order: "asc" });
  const [isScrolled, setIsScrolled] = useState(false);

  /** ----------------------------------------
   * BACKEND PAGINATION HANDLERS
   * ---------------------------------------- */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchData(newPage + 1, rowsPerPage); // pageNo = 1-based
  };

  const handleChangeRowsPerPage = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
    fetchData(1, newSize);
  };

  /** ----------------------------------------
   * SELECTION HANDLERS
   * ---------------------------------------- */
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = data.map((_, index) => index);
      setSelected(allIds);
      if (onSelectRows) onSelectRows(allIds);
    } else {
      setSelected([]);
      if (onSelectRows) onSelectRows([]);
    }
  };

  const handleSelectRow = (rowIndex) => {
    const selectedIndex = selected.indexOf(rowIndex);
    let newSelected = [];

    if (selectedIndex === -1) newSelected = [...selected, rowIndex];
    else newSelected = selected.filter((i) => i !== rowIndex);

    setSelected(newSelected);
    if (onSelectRows) onSelectRows(newSelected);
  };

  const isSelected = (rowIndex) => selected.indexOf(rowIndex) !== -1;

  /** ----------------------------------------
   * SEARCH + FILTER (FRONTEND ONLY)
   * ---------------------------------------- */
  const matchesSearch = (row) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return columns.some((c) => {
      const value = row[c.id];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(q);
    });
  };

  const matchesStatus = (row) => {
    if (statusFilter === "all") return true;
    const isActive = row.activeBusinesses === true;
    if (statusFilter === "active") return isActive;
    if (statusFilter === "inactive") return !isActive;
    return true;
  };

  /** ----------------------------------------
   * SORTING
   * ---------------------------------------- */
  const handleSort = (columnId) => {
    setSortConfig((prev) => {
      if (prev.orderBy === columnId) {
        if (prev.order === "asc") return { orderBy: columnId, order: "desc" };
        if (prev.order === "desc") return { orderBy: null, order: "asc" }; // reset
      }
      return { orderBy: columnId, order: "asc" };
    });
  };

  const processedData = useMemo(() => {
    const filtered = data.filter(
      (row) => matchesSearch(row) && matchesStatus(row)
    );

    if (!sortConfig.orderBy) return filtered;

    const { orderBy, order } = sortConfig;

    const sorted = [...filtered].sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      let cmp = 0;
      if (typeof aVal === "number" && typeof bVal === "number") {
        cmp = aVal - bVal;
      } else {
        cmp = String(aVal).localeCompare(String(bVal));
      }
      return order === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [data, columns, sortConfig, searchQuery, statusFilter]);

  /** ----------------------------------------
   * SORT INDICATOR
   * ---------------------------------------- */
  const renderSortIndicator = (columnId) => {
    if (sortConfig.orderBy !== columnId) {
      return <span className="sort-indicator sort-indicator--off">⇵</span>;
    }
    return (
      <span className="sort-indicator">
        {sortConfig.order === "asc" ? "▲" : "▼"}
      </span>
    );
  };

  /** ----------------------------------------
   * CELL RENDERING
   * ---------------------------------------- */
  const renderCellContent = (value, columnId, row) => {
    if (columnId === "STATUS" && value === "Active") {
      return <span className="status-active">{value}</span>;
    }

    if (columnId === "BANNER IMAGE" && typeof value === "string") {
      return <img src={value} alt="Banner" className="banner-image" />;
    }

    const col = columns.find((c) => c.id === columnId);
    if (col && col.renderCell) {
      return col.renderCell(row[columnId], row);
    }

    return value ?? "-";
  };

  const allVisibleSelected =
    processedData.length > 0 &&
    processedData.every((_, index) => selected.includes(index));

  /** ----------------------------------------
   * RENDER TABLE
   * ---------------------------------------- */
  return (
    <Paper className={`custom-table-container ${isScrolled ? "table-scrolled" : ""}`}>
      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="toolbar-left">
          <h3 className="table-title">Business List</h3>
          <span className="table-subtitle">
            {total} results {/* Always use backend count */}
            {searchQuery ? ` • filtered` : ""}
          </span>
        </div>

        <div className="toolbar-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-chips">
            <button
              className={`filter-chip ${statusFilter === "all" ? "filter-chip--active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              All
            </button>
            <button
              className={`filter-chip ${statusFilter === "active" ? "filter-chip--active" : ""}`}
              onClick={() => setStatusFilter("active")}
            >
              Active
            </button>
            <button
              className={`filter-chip ${statusFilter === "inactive" ? "filter-chip--active" : ""}`}
              onClick={() => setStatusFilter("inactive")}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      <TableContainer className="table-wrapper" onScroll={(e) => setIsScrolled(e.target.scrollTop > 0)}>
        <Table stickyHeader className="custom-table">
          <TableHead>
            <TableRow className="custom-header-row">
              <TableCell padding="checkbox" className="custom-header-cell checkbox-cell sticky-checkbox">
                <Checkbox
                  color="default"
                  checked={allVisibleSelected}
                  indeterminate={selected.length > 0 && !allVisibleSelected}
                  onChange={handleSelectAll}
                  className="header-checkbox"
                />
              </TableCell>

              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  className="custom-header-cell"
                  onClick={() => handleSort(column.id)}
                >
                  <span className="header-content">
                    <span>{column.label}</span>
                    {renderSortIndicator(column.id)}
                  </span>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {processedData.map((row, rowIndex) => {
              const selectedRow = isSelected(rowIndex);

              return (
                <TableRow
                  key={rowIndex}
                  hover
                  className={`custom-row ${selectedRow ? "selected-row" : ""}`}
                >
                  <TableCell
                    padding="checkbox"
                    className="checkbox-cell sticky-checkbox"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={selectedRow}
                      onChange={() => handleSelectRow(rowIndex)}
                      className="body-checkbox"
                    />
                  </TableCell>

                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className={`custom-body-cell ${column.id === "STATUS" ? "status-cell" : ""}`}
                    >
                      {renderCellContent(row[column.id], column.id, row)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className="pagination-wrapper">
        <TablePagination
          component="div"
          count={total}          // backend total
          page={page}            // current page (0-based)
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          labelRowsPerPage="Rows per page"
          className="pagination"
        />
      </Box>
    </Paper>
  );
};

export default CustomizedTable;
