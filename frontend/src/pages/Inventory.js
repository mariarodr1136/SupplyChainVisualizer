import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaPlus, FaSearch, FaEdit, FaSyncAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import InventoryService from '../services/inventory.service';
import NodeService from '../services/node.service';
import ProductService from '../services/product.service';
import PageHeader from '../components/common/PageHeader';
import InventoryModal from '../components/inventory/InventoryModal';
import './Inventory.css';

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNode, setFilterNode] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [inventoryResponse, nodesResponse, productsResponse] = await Promise.all([
        InventoryService.getAllInventory(),
        NodeService.getAllNodes(),
        ProductService.getAllProducts()
      ]);
      
      setInventoryItems(inventoryResponse.data);
      setNodes(nodesResponse.data);
      setProducts(productsResponse.data);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load inventory data');
      setLoading(false);
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleModalSave = async (inventoryData) => {
    try {
      if (inventoryData.id) {
        // Update existing inventory
        await InventoryService.updateInventory(inventoryData.id, inventoryData);
      } else {
        // Create new inventory
        await InventoryService.createOrUpdateInventory(inventoryData);
      }
      
      // Reload inventory data
      loadInventoryData();
      
      // Close modal
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save inventory:', err);
      alert('Failed to save inventory. Please try again.');
    }
  };

  // Apply filters and search
  const filteredInventory = inventoryItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nodeName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesNode = filterNode === '' || item.nodeId.toString() === filterNode;
    const matchesStatus = filterStatus === '' || item.status === filterStatus;
    
    return matchesSearch && matchesNode && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'optimal':
        return <Badge bg="success">Optimal</Badge>;
      case 'low':
        return <Badge bg="warning">Low</Badge>;
      case 'critical':
        return <Badge bg="danger">Critical</Badge>;
      case 'excess':
        return <Badge bg="info">Excess</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  // Show loading spinner
  if (loading && inventoryItems.length === 0) {
    return (
      <Container>
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading inventory data...</p>
        </div>
      </Container>
    );
  }

  // Show error message
  if (error) {
    return (
      <Container>
        <div className="my-5">
          <Alert variant="danger">
            <Alert.Heading>Error Loading Inventory</Alert.Heading>
            <p>{error}</p>
            <Button variant="outline-danger" onClick={loadInventoryData}>Try Again</Button>
          </Alert>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <PageHeader title="Inventory Management" />
      
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <Form.Group className="me-3">
                    <div className="position-relative">
                      <Form.Control
                        type="text"
                        placeholder="Search products or locations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <FaSearch className="search-icon" />
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="me-3">
                    <Form.Select
                      value={filterNode}
                      onChange={(e) => setFilterNode(e.target.value)}
                      aria-label="Filter by Location"
                    >
                      <option value="">All Locations</option>
                      {nodes.map(node => (
                        <option key={node.id} value={node.id}>
                          {node.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  
                  <Form.Group>
                    <Form.Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      aria-label="Filter by Status"
                    >
                      <option value="">All Statuses</option>
                      <option value="optimal">Optimal</option>
                      <option value="low">Low</option>
                      <option value="critical">Critical</option>
                      <option value="excess">Excess</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                
                <div>
                  <Button variant="outline-secondary" className="me-2" onClick={loadInventoryData}>
                    <FaSyncAlt /> Refresh
                  </Button>
                  <Button variant="primary" onClick={handleAddNew}>
                    <FaPlus /> Add Inventory
                  </Button>
                </div>
              </div>
              
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Min Threshold</th>
                    <th>Max Threshold</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.length > 0 ? (
                    filteredInventory.map(item => {
                      const node = nodes.find(n => n.id === item.nodeId);
                      return (
                        <tr key={item.id}>
                          <td>
                            <Link to={`/nodes/${item.nodeId}`}>
                              {node ? node.name : `Location ID: ${item.nodeId}`}
                            </Link>
                          </td>
                          <td>
                            <Link to={`/products/${item.productId}`}>
                              {item.productName}
                            </Link>
                          </td>
                          <td>{item.quantity}</td>
                          <td>{item.minThreshold || '-'}</td>
                          <td>{item.maxThreshold || '-'}</td>
                          <td>{getStatusBadge(item.status)}</td>
                          <td>{new Date(item.updatedAt).toLocaleString()}</td>
                          <td>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              <FaEdit /> Edit
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        No inventory items found. Adjust your filters or add new inventory.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Inventory Modal */}
      <InventoryModal
        show={showModal}
        onHide={() => setShowModal(false)}
        inventoryItem={selectedItem}
        nodes={nodes}
        products={products}
        onSave={handleModalSave}
        isNew={!selectedItem}
      />
    </Container>
  );
};

export default Inventory;