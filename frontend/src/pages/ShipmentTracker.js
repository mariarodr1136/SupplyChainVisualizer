import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Badge, Spinner, Alert, ProgressBar } from 'react-bootstrap';
import { FaPlus, FaSearch, FaEye, FaSyncAlt, FaRegCheckCircle, FaExclamationTriangle, FaBoxOpen, FaPrint } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ShipmentService from '../services/shipment.service';
import NodeService from '../services/node.service';
import PageHeader from '../components/common/PageHeader';
import ShipmentModal from '../components/shipment/ShipmentModal';
import ShipmentDetailsModal from '../components/shipment/ShipmentDetailsModal';
import './ShipmentTracker.css';

const ShipmentTracker = () => {
  const [shipments, setShipments] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  useEffect(() => {
    loadShipmentData();
  }, []);

  const loadShipmentData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [shipmentsResponse, nodesResponse] = await Promise.all([
        ShipmentService.getAllShipments(),
        NodeService.getAllNodes()
      ]);
      
      setShipments(shipmentsResponse.data);
      setNodes(nodesResponse.data);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load shipment data');
      setLoading(false);
      console.error(err);
    }
  };

  const handleShowDetails = (shipment) => {
    setSelectedShipment(shipment);
    setShowDetailsModal(true);
  };

  const handleAddNew = () => {
    setSelectedShipment(null);
    setShowAddModal(true);
  };

  const handleCreateShipment = async (shipmentData) => {
    try {
      await ShipmentService.createShipment(shipmentData);
      
      // Reload shipment data
      loadShipmentData();
      
      // Close modal
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to create shipment:', err);
      alert('Failed to create shipment. Please try again.');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await ShipmentService.updateShipmentStatus(id, status);
      
      // Update local state
      setShipments(shipments.map(shipment => 
        shipment.id === id ? { ...shipment, status } : shipment
      ));
      
      // If the selected shipment is updated, update it too
      if (selectedShipment && selectedShipment.id === id) {
        setSelectedShipment({ ...selectedShipment, status });
      }
    } catch (err) {
      console.error('Failed to update shipment status:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  // Apply filters and search
  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = searchTerm === '' || 
      `${shipment.id}`.includes(searchTerm) ||
      shipment.sourceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destinationName?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = filterStatus === '' || shipment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'in_transit':
        return <Badge bg="info">In Transit</Badge>;
      case 'delivered':
        return <Badge bg="success">Delivered</Badge>;
      case 'delayed':
        return <Badge bg="danger">Delayed</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getProgressValue = (status) => {
    switch (status) {
      case 'pending':
        return 25;
      case 'in_transit':
        return 50;
      case 'delayed':
        return 50;
      case 'delivered':
        return 100;
      default:
        return 0;
    }
  };

  const getProgressVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_transit':
        return 'info';
      case 'delivered':
        return 'success';
      case 'delayed':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // Show loading spinner
  if (loading && shipments.length === 0) {
    return (
      <Container>
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading shipment data...</p>
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
            <Alert.Heading>Error Loading Shipments</Alert.Heading>
            <p>{error}</p>
            <Button variant="outline-danger" onClick={loadShipmentData}>Try Again</Button>
          </Alert>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <PageHeader title="Shipment Tracker" />
      
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
                        placeholder="Search by ID or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <FaSearch className="search-icon" />
                    </div>
                  </Form.Group>
                  
                  <Form.Group>
                    <Form.Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      aria-label="Filter by Status"
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="in_transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="delayed">Delayed</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                
                <div>
                  <Button variant="outline-secondary" className="me-2" onClick={loadShipmentData}>
                    <FaSyncAlt /> Refresh
                  </Button>
                  <Button variant="primary" onClick={handleAddNew}>
                    <FaPlus /> New Shipment
                  </Button>
                </div>
              </div>
              
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Departure</th>
                    <th>Expected Arrival</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShipments.length > 0 ? (
                    filteredShipments.map(shipment => (
                      <tr key={shipment.id}>
                        <td>#{shipment.id}</td>
                        <td>
                          <Link to={`/nodes/${shipment.sourceId}`}>
                            {shipment.sourceName}
                          </Link>
                        </td>
                        <td>
                          <Link to={`/nodes/${shipment.destinationId}`}>
                            {shipment.destinationName}
                          </Link>
                        </td>
                        <td>{getStatusBadge(shipment.status)}</td>
                        <td>
                          <ProgressBar 
                            now={getProgressValue(shipment.status)} 
                            variant={getProgressVariant(shipment.status)}
                            style={{ height: '0.5rem' }}
                          />
                        </td>
                        <td>
                          {shipment.departureDate 
                            ? new Date(shipment.departureDate).toLocaleDateString() 
                            : 'Not set'}
                        </td>
                        <td>
                          {shipment.estimatedArrival 
                            ? new Date(shipment.estimatedArrival).toLocaleDateString() 
                            : 'Not set'}
                        </td>
                        <td>
                          <Button 
                            variant="outline-info" 
                            size="sm"
                            className="me-1"
                            onClick={() => handleShowDetails(shipment)}
                            title="View Details"
                          >
                            <FaEye />
                          </Button>
                          
                          {shipment.status === 'pending' && (
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              className="me-1"
                              onClick={() => handleUpdateStatus(shipment.id, 'in_transit')}
                              title="Mark as In Transit"
                            >
                              <FaBoxOpen />
                            </Button>
                          )}
                          
                          {(shipment.status === 'in_transit' || shipment.status === 'delayed') && (
                            <Button 
                              variant="outline-success" 
                              size="sm"
                              className="me-1"
                              onClick={() => handleUpdateStatus(shipment.id, 'delivered')}
                              title="Mark as Delivered"
                            >
                              <FaRegCheckCircle />
                            </Button>
                          )}
                          
                          {shipment.status === 'in_transit' && (
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              className="me-1"
                              onClick={() => handleUpdateStatus(shipment.id, 'delayed')}
                              title="Mark as Delayed"
                            >
                              <FaExclamationTriangle />
                            </Button>
                          )}
                          
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            title="Print"
                          >
                            <FaPrint />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        No shipments found. Adjust your filters or create a new shipment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Shipment Details Modal */}
      <ShipmentDetailsModal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        shipment={selectedShipment}
        onUpdateStatus={handleUpdateStatus}
      />
      
      {/* New Shipment Modal */}
      <ShipmentModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        nodes={nodes}
        onSave={handleCreateShipment}
      />
    </Container>
  );
};

export default ShipmentTracker;