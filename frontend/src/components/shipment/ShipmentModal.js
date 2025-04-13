import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import ProductService from '../../services/product.service';

const ShipmentModal = ({ show, onHide, nodes, onSave }) => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    sourceId: '',
    destinationId: '',
    status: 'pending',
    departureDate: '',
    estimatedArrival: '',
    items: []
  });
  const [newItem, setNewItem] = useState({
    productId: '',
    quantity: 1
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      // Reset form when modal is shown
      setFormData({
        sourceId: nodes.length > 0 ? nodes[0].id : '',
        destinationId: nodes.length > 1 ? nodes[1].id : '',
        status: 'pending',
        departureDate: getTodayISOString(),
        estimatedArrival: getTomorrowISOString(),
        items: []
      });
      
      // Load products
      loadProducts();
    }
  }, [show, nodes]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductService.getAllProducts();
      setProducts(response.data);
      
      // Initialize first product
      if (response.data.length > 0) {
        setNewItem({
          productId: response.data[0].id,
          quantity: 1
        });
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to load products:', err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: name === 'quantity' ? parseInt(value, 10) : value
    });
  };

  const handleAddItem = () => {
    if (!newItem.productId || newItem.quantity < 1) return;
    
    // Find product details
    const product = products.find(p => p.id === newItem.productId);
    
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          ...newItem,
          productName: product ? product.name : `Product ID: ${newItem.productId}`
        }
      ]
    });
    
    // Reset new item form but keep the same product selected
    setNewItem({
      ...newItem,
      quantity: 1
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    
    setFormData({
      ...formData,
      items: updatedItems
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.sourceId || !formData.destinationId || formData.items.length === 0) {
      alert('Please fill all required fields and add at least one item.');
      return;
    }
    
    onSave(formData);
  };

  // Helper function to get today's date in ISO format for the date input
  const getTodayISOString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Helper function to get tomorrow's date in ISO format for the date input
  const getTomorrowISOString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
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
        <Modal.Title>Create New Shipment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Source Location</Form.Label>
                <Form.Select
                  name="sourceId"
                  value={formData.sourceId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Source</option>
                  {nodes.map(node => (
                    <option key={node.id} value={node.id}>
                      {node.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Destination</Form.Label>
                <Form.Select
                  name="destinationId"
                  value={formData.destinationId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Destination</option>
                  {nodes.map(node => (
                    <option 
                      key={node.id} 
                      value={node.id}
                      disabled={node.id === formData.sourceId}
                    >
                      {node.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Departure Date</Form.Label>
                <Form.Control
                  type="date"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Estimated Arrival</Form.Label>
                <Form.Control
                  type="date"
                  name="estimatedArrival"
                  value={formData.estimatedArrival}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
          </div>
          
          <hr />
          
          <h5>Shipment Items</h5>
          <div className="row align-items-end mb-3">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Product</Form.Label>
                <Form.Select
                  name="productId"
                  value={newItem.productId}
                  onChange={handleItemChange}
                  disabled={products.length === 0}
                >
                  {products.length === 0 ? (
                    <option value="">No products available</option>
                  ) : (
                    products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </option>
                    ))
                  )}
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  name="quantity"
                  value={newItem.quantity}
                  onChange={handleItemChange}
                />
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Button 
                variant="outline-primary" 
                onClick={handleAddItem}
                className="w-100"
                disabled={!newItem.productId || products.length === 0}
              >
                <FaPlus className="me-1" /> Add Item
              </Button>
            </div>
          </div>
          
          {formData.items.length === 0 ? (
            <div className="text-center text-muted my-4">
              <p>No items added yet. Add at least one item to the shipment.</p>
            </div>
          ) : (
            <Table responsive bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <FaTrashAlt />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={!formData.sourceId || !formData.destinationId || formData.items.length === 0}
        >
          Create Shipment
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShipmentModal;