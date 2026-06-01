import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { FaExclamationTriangle, FaSyncAlt } from 'react-icons/fa';
import PageHeader from '../components/common/PageHeader';
import ShipmentService from '../services/shipment.service';
import InventoryService from '../services/inventory.service';

const REFRESH_INTERVAL_MS = 30000;

const relativeTime = (isoString) => {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} days ago`;
};

const buildAlerts = (delayedShipments, lowStockItems) => {
  const shipmentAlerts = delayedShipments.map((s) => ({
    id: `SHP-${s.id}`,
    type: 'Delay',
    severity: 'High',
    message: `Shipment #${s.id} from ${s.sourceName} → ${s.destinationName} is delayed`,
    time: s.departureDate ? `Departed ${s.departureDate}` : 'Date unknown',
  }));

  const inventoryAlerts = lowStockItems.map((i) => ({
    id: `INV-${i.id}`,
    type: 'Low Stock',
    severity: i.status === 'critical' ? 'High' : 'Medium',
    message: `${i.productName} below threshold at ${i.nodeName} (${i.quantity} / min ${i.minThreshold})`,
    time: relativeTime(i.updatedAt),
  }));

  return [...shipmentAlerts, ...inventoryAlerts];
};

const severityVariant = (severity) => {
  if (severity === 'High') return 'danger';
  if (severity === 'Medium') return 'warning';
  return 'secondary';
};

const LiveAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAlerts = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const [delayedRes, lowStockRes] = await Promise.all([
        ShipmentService.getShipmentsByStatus('delayed'),
        InventoryService.getLowStockInventory(),
      ]);
      setAlerts(buildAlerts(delayedRes.data, lowStockRes.data));
      setLastUpdated(new Date());
      setError(null);
    } catch {
      setError('Failed to load alerts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(() => fetchAlerts(), REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  return (
    <Container fluid className="alerts-page">
      <PageHeader title="Live Alerts" />

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <FaExclamationTriangle className="me-2 text-danger" />
                <h5 className="m-0 dashboard-section-title">Exceptions Feed</h5>
                {lastUpdated && (
                  <small className="text-muted ms-3">
                    Updated {relativeTime(lastUpdated.toISOString())}
                  </small>
                )}
              </div>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => fetchAlerts(true)}
                disabled={refreshing}
              >
                <FaSyncAlt className={`me-1 ${refreshing ? 'fa-spin' : ''}`} /> Refresh
              </Button>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center my-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : alerts.length === 0 ? (
                <p className="text-center text-muted my-4">No active alerts</p>
              ) : (
                <Table responsive hover className="dashboard-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Type</th>
                      <th>Severity</th>
                      <th>Message</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.map((alert) => (
                      <tr key={alert.id}>
                        <td>{alert.id}</td>
                        <td>{alert.type}</td>
                        <td>
                          <Badge bg={severityVariant(alert.severity)}>{alert.severity}</Badge>
                        </td>
                        <td>{alert.message}</td>
                        <td>{alert.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LiveAlerts;
