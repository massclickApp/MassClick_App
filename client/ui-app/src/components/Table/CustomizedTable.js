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

const CustomizedTable = ({ columns = [], data = [], onSelectRows }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive
  const [sortConfig, setSortConfig] = useState({ orderBy: null, order: "asc" });
  const [isScrolled, setIsScrolled] = useState(false);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allVisibleIds = processedData.map((item) => item.originalIndex);
      setSelected(allVisibleIds);
      if (onSelectRows) onSelectRows(allVisibleIds);
    } else {
      setSelected([]);
      if (onSelectRows) onSelectRows([]);
    }
  };

  const handleSelectRow = (originalIndex) => {
    const selectedIndex = selected.indexOf(originalIndex);
    let newSelected = [];

    if (selectedIndex === -1) newSelected = [...selected, originalIndex];
    else newSelected = selected.filter((i) => i !== originalIndex);

    setSelected(newSelected);
    if (onSelectRows) onSelectRows(newSelected);
  };

  const isSelected = (originalIndex) => selected.indexOf(originalIndex) !== -1;

  const handleTableScroll = (e) => {
    const top = e.target.scrollTop;
    setIsScrolled(top > 0);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPage(0);
  };

  const handleSort = (columnId) => {
    setSortConfig((prev) => {
      if (prev.orderBy === columnId) {
        if (prev.order === "asc") return { orderBy: columnId, order: "desc" };
        if (prev.order === "desc") return { orderBy: null, order: "asc" }; // reset
      }
      return { orderBy: columnId, order: "asc" };
    });
  };

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


  const processedData = useMemo(() => {
    const mapped = data.map((row, originalIndex) => ({ row, originalIndex }));

    const filtered = mapped.filter(
      ({ row }) => matchesSearch(row) && matchesStatus(row)
    );

    if (!sortConfig.orderBy) return filtered;

    const { orderBy, order } = sortConfig;

    const sorted = [...filtered].sort((a, b) => {
      const col = columns.find((c) => c.id === orderBy);
      const aVal = a.row[orderBy];
      const bVal = b.row[orderBy];

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

  const displayedRows = processedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const renderSortIndicator = (columnId) => {
    if (sortConfig.orderBy !== columnId) {
      return <span className="sort-indicator sort-indicator--off">⇵</span>;
    }
    if (sortConfig.order === "asc") {
      return <span className="sort-indicator">▲</span>;
    }
    if (sortConfig.order === "desc") {
      return <span className="sort-indicator">▼</span>;
    }
  };

  const renderCellContent = (value, columnId, row) => {
    if (columnId === "STATUS" && value === "Active") {
      return <span className="status-active">{value}</span>;
    }

    if (columnId === "BANNER IMAGE" && typeof value === "string") {
      return <img src={value} alt="Banner" className="banner-image" />;
    }

    const column = columns.find((c) => c.id === columnId);
    if (column && column.renderCell) {
      return column.renderCell(row[columnId], row);
    }

    return value ?? "-";
  };

  const allVisibleSelected =
    processedData.length > 0 &&
    processedData.every((item) => selected.includes(item.originalIndex));

  return (
    <Paper
      className={`custom-table-container ${isScrolled ? "table-scrolled" : ""
        }`}
    >
      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="toolbar-left">
          <h3 className="table-title">Business List</h3>
          <span className="table-subtitle">
            {processedData.length} results
            {searchQuery ? ` • filtered` : ""}
          </span>
        </div>
        <div className="toolbar-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="filter-chips">
            <button
              className={`filter-chip ${statusFilter === "all" ? "filter-chip--active" : ""
                }`}
              onClick={() => handleStatusFilterChange("all")}
            >
              All
            </button>
            <button
              className={`filter-chip ${statusFilter === "active" ? "filter-chip--active" : ""
                }`}
              onClick={() => handleStatusFilterChange("active")}
            >
              Active
            </button>
            <button
              className={`filter-chip ${statusFilter === "inactive" ? "filter-chip--active" : ""
                }`}
              onClick={() => handleStatusFilterChange("inactive")}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      <TableContainer className="table-wrapper" onScroll={handleTableScroll}>
        <Table stickyHeader className="custom-table">
          <TableHead>
            <TableRow className="custom-header-row">
              <TableCell
                padding="checkbox"
                className="custom-header-cell checkbox-cell sticky-checkbox"
              >
                <Checkbox
                  color="default"
                  checked={allVisibleSelected}
                  indeterminate={
                    selected.length > 0 && !allVisibleSelected
                  }
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
            {displayedRows.map(({ row, originalIndex }, rowIndex) => {
              const selectedRow = isSelected(originalIndex);
              return (
                <TableRow
                  key={rowIndex}
                  hover
                  className={`custom-row ${selectedRow ? "selected-row" : ""
                    }`}
                >
                  <TableCell
                    padding="checkbox"
                    className="checkbox-cell sticky-checkbox"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={selectedRow}
                      onChange={() => handleSelectRow(originalIndex)}
                      className="body-checkbox"
                    />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className={`custom-body-cell ${column.id === "STATUS" ? "status-cell" : ""
                        }`}
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
          count={processedData.length}
          page={page}
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
