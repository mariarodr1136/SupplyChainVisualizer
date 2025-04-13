import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ConnectionModal = ({ show, onHide, connection, nodes, onSave, isNew }) => {
  const [formData, setFormData] = useState({
    sourceId: '',
    targetId: '',
    transportationType: 'truck',
    travelTime: '',
    distance: '',
    costPerUnit: '',
    status: 'active'
  });

  useEffect(() => {
    if (connection) {
      setFormData({
        ...connection
      });
    } else {
      // Reset form for new connection
      setFormData({
        sourceId: nodes.length > 0 ? nodes[0].id : '',
        targetId: nodes.length > 1 ? nodes[1].id : '',
        transportationType: 'truck',
        travelTime: '',
        distance: '',
        costPerUnit: '',
        status: 'active'
      });
    }
  }, [connection, nodes]);

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
        <Modal.Title>{isNew ? 'Add New Connection' : 'Edit Connection'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Source Node</Form.Label>
            <Form.Select
              name="sourceId"
              value={formData.sourceId}
              onChange={handleChange}
              required
            >
              <option value="">Select Source Node</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>
                  {node.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Target Node</Form.Label>
            <Form.Select
              name="targetId"
              value={formData.targetId}
              onChange={handleChange}
              required
            >
              <option value="">Select Target Node</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>
                  {node.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Transportation Type</Form.Label>
            <Form.Select
              name="transportationType"
              value={formData.transportationType}
              onChange={handleChange}
            >
              <option value="truck">Truck</option>
              <option value="train">Train</option>
              <option value="ship">Ship</option>
              <option value="air">Air</option>
            </Form.Select>
          </Form.Group>

          <div className="row">
            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>Travel Time (hours)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  name="travelTime"
                  value={formData.travelTime}
                  onChange={handleNumberChange}
                />
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>Distance (km)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  name="distance"
                  value={formData.distance}
                  onChange={handleNumberChange}
                />
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>Cost Per Unit</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  name="costPerUnit"
                  value={formData.costPerUnit}
                  onChange={handleNumberChange}
                />
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="delayed">Delayed</option>
              <option value="at_capacity">At Capacity</option>
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

export default ConnectionModal;