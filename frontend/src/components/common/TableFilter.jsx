import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

const TableFilter = ({ filters, onFilter }) => {
  const [filterValues, setFilterValues] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterValues({
      ...filterValues,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filterValues);
  };

  const handleReset = () => {
    setFilterValues({});
    onFilter({});
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Row>
        {filters.map((filter) => (
          <Col key={filter.name} md={3} className="mb-3">
            <Form.Group>
              <Form.Label>{filter.label}</Form.Label>
              <Form.Control
                type={filter.type || 'text'}
                name={filter.name}
                value={filterValues[filter.name] || ''}
                onChange={handleInputChange}
                placeholder={filter.placeholder || ''}
              />
            </Form.Group>
          </Col>
        ))}
        <Col md={3} className="mb-3 d-flex align-items-end">
          <div>
            <Button variant="primary" type="submit" className="me-2">
              Filter
            </Button>
            <Button variant="secondary" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default TableFilter;