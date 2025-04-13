import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaPlus, FaSearch, FaEdit, FaTrashAlt, FaSyncAlt, FaEye } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import NodeService from '../services/node.service';
import PageHeader from '../components/common/PageHeader';
import NodeModal from '../components/map/NodeModal';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';
import './Nodes.css';

const Nodes = () => {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadNodesData();
  }, []);

  const loadNodesData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await NodeService.getAllNodes();
      setNodes(response.data);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load nodes data');
      setLoading(false);
      console.error(err);
    }
  };

  const handleEdit = (node) => {
    setSelectedNode(node);
    setShowModal(true);
  };

  const handleDelete = (node) => {
    setSelectedNode(node);
    setShowDeleteModal(true);
  };

  const handleViewDetails = (nodeId) => {
    navigate(`/nodes/${nodeId}`);
  };

  const handleAddNew = () => {
    setSelectedNode(null);
    setShowModal(true);
  };

  const handleModalSave = async (nodeData) => {
    try {
      if (nodeData.id) {
        // Update existing node
        await NodeService.updateNode(nodeData.id, nodeData);
      } else {
        // Create new node
        await NodeService.createNode(nodeData);
      }
      
      // Reload nodes data
      loadNodesData();
      
      // Close modal
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save node:', err);
      alert('Failed to save node. Please try again.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedNode) return;
    
    try {
      await NodeService.deleteNode(selectedNode.id);
      
      // Remove from local state
      setNodes(nodes.filter(node => node.id !== selectedNode.id));
      
      // Close modal
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Failed to delete node:', err);
      alert('Failed to delete node. Please try again.');
    }
  };

  // Apply filters and search
  const filteredNodes = nodes.filter(node => {
    const matchesSearch = searchTerm === '' || 
      node.name.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = filterType === '' || node.type === filterType;
    const matchesStatus = filterStatus === '' || node.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getNodeTypeName = (type) => {
    switch (type) {
      case 'factory':
        return 'Factory';
      case 'warehouse':
        return 'Warehouse';
      case 'store':
        return 'Store';
      case 'supplier':
        return 'Supplier';
      default:
        return type;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Active</Badge>;
      case 'warning':
        return <Badge bg="warning">Warning</Badge>;
      case 'critical':
        return <Badge bg="danger">Critical</Badge>;
      case 'inactive':
        return <Badge bg="secondary">Inactive</Badge>;
      default:
        return <Badge bg="info">{status}</Badge>;
    }
  };

  // Show loading spinner
  if (loading && nodes.length === 0) {
    return (
      <Container>
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading nodes data...</p>
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
            <Alert.Heading>Error Loading Nodes</Alert.Heading>
            <p>{error}</p>
            <Button variant="outline-danger" onClick={loadNodesData}>Try Again</Button>
          </Alert>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <PageHeader title="Network Nodes" />
      
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
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <FaSearch className="search-icon" />
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="me-3">
                    <Form.Select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      aria-label="Filter by Type"
                    >
                      <option value="">All Types</option>
                      <option value="factory">Factory</option>
                      <option value="warehouse">Warehouse</option>
                      <option value="store">Store</option>
                      <option value="supplier">Supplier</option>
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
                      <option value="warning">Warning</option>
                      <option value="critical">Critical</option>
                      <option value="inactive">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                
                <div>
                  <Button variant="outline-secondary" className="me-2" onClick={loadNodesData}>
                    <FaSyncAlt /> Refresh
                  </Button>
                  <Button variant="primary" onClick={handleAddNew}>
                    <FaPlus /> Add Node
                  </Button>
                </div>
              </div>
              
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNodes.length > 0 ? (
                    filteredNodes.map(node => (
                      <tr key={node.id}>
                        <td>{node.name}</td>
                        <td>{getNodeTypeName(node.type)}</td>
                        <td>
                          {node.latitude.toFixed(6)}, {node.longitude.toFixed(6)}
                        </td>
                        <td>{node.capacity || '-'}</td>
                        <td>{getStatusBadge(node.status)}</td>
                        <td>
                          <Button 
                            variant="outline-info" 
                            size="sm"
                            className="me-1"
                            onClick={() => handleViewDetails(node.id)}
                            title="View Details"
                          >
                            <FaEye />
                          </Button>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            className="me-1"
                            onClick={() => handleEdit(node)}
                            title="Edit"
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDelete(node)}
                            title="Delete"
                          >
                            <FaTrashAlt />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No nodes found. Adjust your filters or add a new node.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Node Modal */}
      <NodeModal
        show={showModal}
        onHide={() => setShowModal(false)}
        node={selectedNode}
        onSave={handleModalSave}
        isNew={!selectedNode}
      />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Node"
        message={`Are you sure you want to delete the node "${selectedNode?.name}"? This action cannot be undone.`}
      />
    </Container>
  );
};

export default Nodes;