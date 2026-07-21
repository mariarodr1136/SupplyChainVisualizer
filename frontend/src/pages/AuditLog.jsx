import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Spinner, Alert } from 'react-bootstrap';
import { FaSearch, FaSyncAlt, FaTruck, FaBoxOpen } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import ShipmentService from '../services/shipment.service';
import InventoryService from '../services/inventory.service';
import PageHeader from '../components/common/PageHeader';
import './AuditLog.css';

const SHIPMENT_STATUS_META = {
  pending: { label: 'Pending', color: '#fbbf24', verb: 'created' },
  in_transit: { label: 'In Transit', color: '#38bdf8', verb: 'departed' },
  delivered: { label: 'Delivered', color: '#34d399', verb: 'delivered' },
  delayed: { label: 'Delayed', color: '#f87171', verb: 'delayed' },
};

const INVENTORY_STATUS_META = {
  optimal: { label: 'Optimal', color: '#34d399' },
  low: { label: 'Low', color: '#fbbf24' },
  critical: { label: 'Critical', color: '#f87171' },
  excess: { label: 'Excess', color: '#38bdf8' },
};

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const AuditLog = () => {
  const [shipments, setShipments] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const location = useLocation();

  useEffect(() => {
    loadAuditData();
  }, [location.key]);

  const loadAuditData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [shipmentsRes, inventoryRes] = await Promise.all([
        ShipmentService.getAllShipments(),
        InventoryService.getAllInventory(),
      ]);

      setShipments(shipmentsRes.data);
      setInventory(inventoryRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load activity data');
      setLoading(false);
      console.error(err);
    }
  };

  const events = [
    ...shipments.map((s) => ({
      key: `shipment-${s.id}`,
      type: 'Shipment',
      icon: <FaTruck />,
      timestamp: s.createdAt,
      color: SHIPMENT_STATUS_META[s.status]?.color || '#9c9c9c',
      title: `Shipment #${s.id} ${SHIPMENT_STATUS_META[s.status]?.verb || 'updated'}`,
      detail: `${s.sourceName || 'Unknown'} → ${s.destinationName || 'Unknown'}`,
    })),
    ...inventory.map((i) => ({
      key: `inventory-${i.id}`,
      type: 'Inventory',
      icon: <FaBoxOpen />,
      timestamp: i.updatedAt,
      color: INVENTORY_STATUS_META[i.status]?.color || '#9c9c9c',
      title: `${i.productName || 'Item'} updated at ${i.nodeName || 'Unknown node'}`,
      detail: `${i.quantity} units on hand · ${INVENTORY_STATUS_META[i.status]?.label || i.status}`,
    })),
  ]
    .filter((e) => e.timestamp)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      searchTerm === '' ||
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.detail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === '' || e.type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading && events.length === 0) {
    return (
      <Container>
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading activity log...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="my-5">
          <Alert variant="danger">
            <Alert.Heading>Error Loading Activity Log</Alert.Heading>
            <p>{error}</p>
            <button className="btn btn-outline-danger" onClick={loadAuditData}>Try Again</button>
          </Alert>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="audit-log-page">
      <PageHeader title="Audit Log" subtitle="Full history of shipment and inventory events" />

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
                        placeholder="Search activity..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <FaSearch className="search-icon" />
                    </div>
                  </Form.Group>

                  <Form.Group>
                    <Form.Select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      aria-label="Filter by Type"
                    >
                      <option value="">All Types</option>
                      <option value="Shipment">Shipments</option>
                      <option value="Inventory">Inventory</option>
                    </Form.Select>
                  </Form.Group>
                </div>

                <button className="btn btn-outline-secondary btn-sm" onClick={loadAuditData}>
                  <FaSyncAlt /> Refresh
                </button>
              </div>

              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Event</th>
                    <th>Detail</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <tr key={event.key}>
                        <td>
                          <span className="audit-type-icon" style={{ color: event.color, borderColor: event.color }}>
                            {event.icon}
                          </span>
                          {event.type}
                        </td>
                        <td>{event.title}</td>
                        <td className="text-muted">{event.detail}</td>
                        <td className="text-muted">{formatDateTime(event.timestamp)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        No activity found. Adjust your filters.
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

export default AuditLog;
