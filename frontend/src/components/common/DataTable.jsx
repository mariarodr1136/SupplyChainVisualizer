import React from 'react';
import { Table, Pagination, Form } from 'react-bootstrap';
import './DataTable.css';

const DataTable = ({
  columns,
  data,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  isLoading,
  onRowClick
}) => {
  // Generate pagination items
  const paginationItems = [];
  for (let page = 1; page <= totalPages; page++) {
    paginationItems.push(
      <Pagination.Item 
        key={page} 
        active={page === currentPage}
        onClick={() => onPageChange(page)}
      >
        {page}
      </Pagination.Item>
    );
  }

  return (
    <div className="data-table-container">
      <div className="data-table-header">
        <div className="data-table-page-size">
          <span>Show</span>
          <Form.Select
            className="mx-2"
            style={{ width: '70px' }}
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </Form.Select>
          <span>entries</span>
        </div>
      </div>

      <div className="table-responsive">
        <Table hover>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} style={column.style || {}}>
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr 
                  key={row.id || rowIndex} 
                  onClick={() => onRowClick && onRowClick(row)}
                  className={onRowClick ? 'clickable-row' : ''}
                >
                  {columns.map((column) => (
                    <td 
                      key={`${rowIndex}-${column.key}`} 
                      style={column.cellStyle || {}}
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      <div className="data-table-footer">
        <div className="data-table-info">
          Showing {data.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
          {Math.min(currentPage * pageSize, data.length)} of {data.length} entries
        </div>
        <Pagination>
          <Pagination.First
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {paginationItems}
          <Pagination.Next
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </div>
  );
};

export default DataTable;