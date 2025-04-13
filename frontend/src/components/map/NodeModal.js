import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const NodeModal = ({ show, onHide, node, onSave, isNew }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'warehouse',
    latitude: '',
    longitude: '',
    capacity: '',
    status: 'active'
  });

  useEffect(() => {
    if (node) {
      setFormData({
        ...node
      });
    } else {
      // Reset form for new node
      setFormData({
        name: '',
        type: 'warehouse',
        latitude: '',
        longitude: '',
        capacity: '',
        status: 'active'
      });
    }
  }, [node]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === '' ? '' : parseFloat(value)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>{isNew ? 'Add New Node' : 'Edit Node'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="factory">Factory</option>
              <option value="warehouse">Warehouse</option>
              <option value="store">Store</option>
              <option value="supplier">Supplier</option>
            </Form.Select>
          </Form.Group>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Latitude</Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleNumberChange}
                  required
                />
                <Form.Text className="text-muted">
                  Between -90 and 90
                </Form.Text>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Longitude</Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleNumberChange}
                  required
                />
                <Form.Text className="text-muted">
                  Between -180 and 180
                </Form.Text>
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Capacity</Form.Label>
            <Form.Control
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleNumberChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
              <option value="inactive">Inactive</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {isNew ? 'Create' : 'Save Changes'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NodeModal;