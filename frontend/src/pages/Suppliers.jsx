import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaSearch, FaSyncAlt, FaExternalLinkAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import NodeService from '../services/node.service';
import ConnectionService from '../services/connection.service';
import ShipmentService from '../services/shipment.service';
import PageHeader from '../components/common/PageHeader';
import './Suppliers.css';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const location = useLocation();

  useEffect(() => {
    loadSuppliersData();
  }, [location.key]);

  const loadSuppliersData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [suppliersRes, connectionsRes, shipmentsRes] = await Promise.all([
        NodeService.getNodesByType('supplier'),
        ConnectionService.getAllConnections(),
        ShipmentService.getAllShipments(),
      ]);

      setSuppliers(suppliersRes.data);
      setConnections(connectionsRes.data);
      setShipments(shipmentsRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load suppliers data');
      setLoading(false);
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Active</Badge>;
      case 'warning':
        return <Badge bg="warning">Warning</Badge>;
      case 'inactive':
        return <Badge bg="secondary">Inactive</Badge>;
      default:
        return <Badge bg="info">{status}</Badge>;
    }
  };

  const enrichedSuppliers = suppliers.map((supplier) => {
    const outboundRoutes = connections.filter((c) => c.sourceId === supplier.id);
    const activeShipments = shipments.filter(
      (s) => s.sourceId === supplier.id && (s.status === 'in_transit' || s.status === 'pending')
    );
    return {
      ...supplier,
      routeCount: outboundRoutes.length,
      activeShipmentCount: activeShipments.length,
    };
  });

  const filteredSuppliers = enrichedSuppliers.filter((supplier) => {
    const matchesSearch =
      searchTerm === '' || supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || supplier.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading && suppliers.length === 0) {
    return (
      <Container>
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading suppliers data...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="my-5">
          <Alert variant="danger">
            <Alert.Heading>Error Loading Suppliers</Alert.Heading>
            <p>{error}</p>
            <button className="btn btn-outline-danger" onClick={loadSuppliersData}>Try Again</button>
          </Alert>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="suppliers-page">
      <PageHeader
        title="Suppliers"
        subtitle="Supplier nodes across your network, with route coverage and active shipments"
      />

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center toolbar-filters">
                  <Form.Group className="me-3 search-group">
                    <div className="position-relative">
                      <Form.Control
                        type="text"
                        placeholder="Search suppliers..."
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
                      <option value="active">Active</option>
                      <option value="warning">Warning</option>
                      <option value="inactive">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </div>

                <button className="btn btn-outline-secondary btn-sm" onClick={loadSuppliersData}>
                  <FaSyncAlt /> Refresh
                </button>
              </div>

              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Supplier</th>
                    <th>Status</th>
                    <th>Capacity</th>
                    <th>Outbound Routes</th>
                    <th>Active Shipments</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuppliers.length > 0 ? (
                    filteredSuppliers.map((supplier) => (
                      <tr key={supplier.id}>
                        <td className="fw-semibold">{supplier.name}</td>
                        <td>{getStatusBadge(supplier.status)}</td>
                        <td>{supplier.capacity ? supplier.capacity.toLocaleString() : '-'}</td>
                        <td>{supplier.routeCount}</td>
                        <td>{supplier.activeShipmentCount}</td>
                        <td>
                          <Link to={`/nodes/${supplier.id}`} title="View node details">
                            <FaExternalLinkAlt />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No suppliers found. Adjust your filters, or add a supplier from the Nodes page.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Suppliers;
