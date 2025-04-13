import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaPlus, FaSearch, FaEdit, FaTrashAlt, FaSyncAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import NodeService from '../services/node.service';
import ConnectionService from '../services/connection.service';
import PageHeader from '../components/common/PageHeader';
import ConnectionModal from '../components/map/ConnectionModal';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';
import './Connections.css';

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTransportType, setFilterTransportType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);

  useEffect(() => {
    loadConnectionsData();
  }, []);

  const loadConnectionsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [connectionsResponse, nodesResponse] = await Promise.all([
        ConnectionService.getAllConnections(),
        NodeService.getAllNodes()
      ]);
      
      // Enrich connections with node names
      const enhancedConnections = connectionsResponse.data.map(connection => {
        const source = nodesResponse.data.find(node => node.id === connection.sourceId);
        const target = nodesResponse.data.find(node => node.id === connection.targetId);
        
        return {
          ...connection,
          sourceName: source?.name || `Node ID: ${connection.sourceId}`,
          targetName: target?.name || `Node ID: ${connection.targetId}`
        };
      });
      
      setConnections(enhancedConnections);
      setNodes(nodesResponse.data);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load connections data');
      setLoading(false);
      console.error(err);
    }
  };

  const handleEdit = (connection) => {
    setSelectedConnection(connection);
    setShowModal(true);
  };

  const handleDelete = (connection) => {
    setSelectedConnection(connection);
    setShowDeleteModal(true);
  };

  const handleAddNew = () => {
    setSelectedConnection(null);
    setShowModal(true);
  };

  const handleModalSave = async (connectionData) => {
    try {
      if (connectionData.id) {
        // Update existing connection
        await ConnectionService.updateConnection(connectionData.id, connectionData);
      } else {
        // Create new connection
        await ConnectionService.createConnection(connectionData);
      }
      
      // Reload connections data
      loadConnectionsData();
      
      // Close modal
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save connection:', err);
      alert('Failed to save connection. Please try again.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedConnection) return;
    
    try {
      await ConnectionService.deleteConnection(selectedConnection.id);
      
      // Remove from local state
      setConnections(connections.filter(connection => connection.id !== selectedConnection.id));
      
      // Close modal
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Failed to delete connection:', err);
      alert('Failed to delete connection. Please try again.');
    }
  };

  // Apply filters and search
  const filteredConnections = connections.filter(connection => {
    const matchesSearch = searchTerm === '' || 
      connection.sourceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.targetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.id.toString().includes(searchTerm);
      
    const matchesTransportType = filterTransportType === '' || 
      connection.transportationType === filterTransportType;
      
    const matchesStatus = filterStatus === '' || connection.status === filterStatus;
    
    return matchesSearch && matchesTransportType && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Active</Badge>;
      case 'delayed':
        return <Badge bg="danger">Delayed</Badge>;
      case 'at_capacity':
        return <Badge bg="warning">At Capacity</Badge>;
      case 'inactive':
        return <Badge bg="secondary">Inactive</Badge>;
      default:
        return <Badge bg="info">{status}</Badge>;
    }
  };

  // Show loading spinner
  if (loading && connections.length === 0) {
    return (
      <Container>
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading connections data...</p>
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
            <Alert.Heading>Error Loading Connections</Alert.Heading>
            <p>{error}</p>
            <Button variant="outline-danger" onClick={loadConnectionsData}>Try Again</Button>
          </Alert>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <PageHeader title="Network Connections" />
      
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
                        placeholder="Search connections..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <FaSearch className="search-icon" />
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="me-3">
                    <Form.Select
                      value={filterTransportType}
                      onChange={(e) => setFilterTransportType(e.target.value)}
                      aria-label="Filter by Transport Type"
                    >
                      <option value="">All Transport Types</option>
                      <option value="truck">Truck</option>
                      <option value="train">Train</option>
                      <option value="air">Air</option>
                      <option value="ship">Ship</option>
                    </Form.Select>
                  </Form.Group>
                  
                  <Form.Group>
                    <Form.Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      aria-label="Filter by Status"
                    >
                      <option value="">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="delayed">Delayed</option>
                      <option value="at_capacity">At Capacity</option>
                      <option value="inactive">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                
                <div>
                  <Button variant="outline-secondary" className="me-2" onClick={loadConnectionsData}>
                    <FaSyncAlt /> Refresh
                  </Button>
                  <Button variant="primary" onClick={handleAddNew}>
                    <FaPlus /> Add Connection
                  </Button>
                </div>
              </div>
              
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Transport Type</th>
                    <th>Travel Time</th>
                    <th>Distance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConnections.length > 0 ? (
                    filteredConnections.map(connection => (
                      <tr key={connection.id}>
                        <td>{connection.id}</td>
                        <td>
                          <Link to={`/nodes/${connection.sourceId}`}>
                            {connection.sourceName}
                          </Link>
                        </td>
                        <td>
                          <Link to={`/nodes/${connection.targetId}`}>
                            {connection.targetName}
                          </Link>
                        </td>
                        <td>{connection.transportationType || 'Not specified'}</td>
                        <td>{connection.travelTime ? `${connection.travelTime} hours` : 'Not specified'}</td>
                        <td>{connection.distance ? `${connection.distance} km` : 'Not specified'}</td>
                        <td>{getStatusBadge(connection.status)}</td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            className="me-1"
                            onClick={() => handleEdit(connection)}
                            title="Edit"
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDelete(connection)}
                            title="Delete"
                          >
                            <FaTrashAlt />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        No connections found. Adjust your filters or add a new connection.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Connection Modal */}
      <ConnectionModal
        show={showModal}
        onHide={() => setShowModal(false)}
        connection={selectedConnection}
        nodes={nodes}
        onSave={handleModalSave}
        isNew={!selectedConnection}
      />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Connection"
        message={`Are you sure you want to delete this connection? This action cannot be undone.`}
      />
    </Container>
  );
};

export default Connections;