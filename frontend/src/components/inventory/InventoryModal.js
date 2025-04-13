import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const InventoryModal = ({ show, onHide, inventoryItem, nodes, products, onSave, isNew }) => {
  const [formData, setFormData] = useState({
    nodeId: '',
    productId: '',
    quantity: '',
    minThreshold: '',
    maxThreshold: ''
  });

  useEffect(() => {
    if (inventoryItem) {
      setFormData({
        ...inventoryItem
      });
    } else {
      // Reset form for new inventory item
      setFormData({
        nodeId: nodes.length > 0 ? nodes[0].id : '',
        productId: products.length > 0 ? products[0].id : '',
        quantity: 0,
        minThreshold: '',
        maxThreshold: ''
      });
    }
  }, [inventoryItem, nodes, products]);

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
      [name]: value === '' ? '' : parseInt(value, 10)
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
    >
      <Modal.Header closeButton>
        <Modal.Title>{isNew ? 'Add Inventory' : 'Edit Inventory'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Select
              name="nodeId"
              value={formData.nodeId}
              onChange={handleChange}
              required
            >
              <option value="">Select Location</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>
                  {node.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Product</Form.Label>
            <Form.Select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              required
            >
              <option value="">Select Product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              min="0"
              name="quantity"
              value={formData.quantity}
              onChange={handleNumberChange}
              required
            />
          </Form.Group>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Minimum Threshold</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  name="minThreshold"
                  value={formData.minThreshold}
                  onChange={handleNumberChange}
                  placeholder="Optional"
                />
                <Form.Text className="text-muted">
                  Triggers low stock alert when quantity falls below this value
                </Form.Text>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Maximum Threshold</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  name="maxThreshold"
                  value={formData.maxThreshold}
                  onChange={handleNumberChange}
                  placeholder="Optional"
                />
                <Form.Text className="text-muted">
                  Triggers excess stock alert when quantity exceeds this value
                </Form.Text>
              </Form.Group>
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {isNew ? 'Add' : 'Save Changes'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InventoryModal;