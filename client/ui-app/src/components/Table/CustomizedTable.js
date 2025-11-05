import React, { useState } from "react";
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

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      // Use the actual data length for selection logic
      const allIds = data.map((_, index) => index);
      setSelected(allIds);
      if (onSelectRows) onSelectRows(allIds);
    } else {
      setSelected([]);
      if (onSelectRows) onSelectRows([]);
    }
  };

  const handleSelectRow = (index) => {
    const selectedIndex = selected.indexOf(index);
    let newSelected = [];

    if (selectedIndex === -1) newSelected = [...selected, index];
    else newSelected = selected.filter((i) => i !== index);

    setSelected(newSelected);
    if (onSelectRows) onSelectRows(newSelected);
  };

  const isSelected = (index) => selected.indexOf(index) !== -1;

  const displayedRows = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Styling for the "Active" status column to match the image
  const renderCellContent = (value, columnId, row) => {
    if (columnId === 'STATUS' && value === 'Active') {
        return (
            <span className="status-active">
                {value}
            </span>
        );
    }
    // Handle the Banner Image rendering (assuming the column.id is 'BANNER IMAGE')
    if (columnId === 'BANNER IMAGE' && typeof value === 'string') {
        return (
            <img 
                src={value} 
                alt="Banner" 
                className="banner-image"
            />
        );
    }

    // Use the existing renderCell for custom rendering
    const column = columns.find(c => c.id === columnId);
    if (column && column.renderCell) {
        return column.renderCell(row[columnId], row);
    }

    return value ?? "-";
  };


  return (
    <Paper className="custom-table-container">
      <TableContainer className="table-wrapper">
        <Table stickyHeader className="custom-table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" className="custom-header-cell checkbox-cell">
                <Checkbox
                  color="default" // Use default to be styled by CSS class
                  checked={selected.length === data.length && data.length > 0}
                  indeterminate={selected.length > 0 && selected.length < data.length}
                  onChange={handleSelectAll}
                  className="header-checkbox"
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column.id} className="custom-header-cell">
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {displayedRows.map((row, rowIndex) => {
              const actualIndex = page * rowsPerPage + rowIndex;
              const selectedRow = isSelected(actualIndex);
              return (
                <TableRow
                  key={rowIndex}
                  hover
                  className={`custom-row ${selectedRow ? "selected-row" : ""}`}
                  // Do not rely solely on row click for selection if checkbox is present,
                  // but keep it for a better UX (optional, you might want to remove this if only checkbox should select)
                  // onClick={() => handleSelectRow(actualIndex)} 
                >
                  <TableCell padding="checkbox" className="checkbox-cell" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedRow}
                      onChange={() => handleSelectRow(actualIndex)}
                      className="body-checkbox"
                    />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell 
                        key={column.id} 
                        className={`custom-body-cell ${column.id === 'STATUS' ? 'status-cell' : ''}`}
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
          count={data.length}
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