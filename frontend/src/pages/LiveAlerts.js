import React from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { FaExclamationTriangle, FaSyncAlt } from 'react-icons/fa';
import PageHeader from '../components/common/PageHeader';

const LiveAlerts = () => {
  const alerts = [
    { id: 'AL-1042', type: 'Delay', severity: 'High', message: 'Connection Central → East delayed by 6 hours', time: '8 min ago' },
    { id: 'AL-1038', type: 'Low Stock', severity: 'Medium', message: 'Sensor Kit below threshold at Northeast DC', time: '22 min ago' },
    { id: 'AL-1031', type: 'Route Issue', severity: 'High', message: 'Weather disruption on Midwest corridor', time: '47 min ago' },
    { id: 'AL-1024', type: 'Exception', severity: 'Low', message: 'PO #8473 awaiting approval', time: '1 hr ago' },
    { id: 'AL-1019', type: 'Delay', severity: 'Medium', message: 'Shipment #9002 tracking stale', time: '2 hrs ago' }
  ];

  const severityVariant = (severity) => {
    if (severity === 'High') return 'danger';
    if (severity === 'Medium') return 'warning';
    return 'secondary';
  };

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
              </div>
              <Button variant="outline-secondary" size="sm">
                <FaSyncAlt className="me-1" /> Refresh
              </Button>
            </Card.Header>
            <Card.Body>
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LiveAlerts;
