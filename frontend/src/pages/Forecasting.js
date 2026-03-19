import React from 'react';
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import PageHeader from '../components/common/PageHeader';

const Forecasting = () => {
  const demandForecast = [
    { sku: 'SC-1001', name: 'Lithium Battery Pack', next30: 820, next60: 1480, confidence: 'High' },
    { sku: 'SC-1002', name: 'Control Module', next30: 540, next60: 990, confidence: 'Medium' },
    { sku: 'SC-1003', name: 'Sensor Kit', next30: 710, next60: 1280, confidence: 'High' },
    { sku: 'SC-1004', name: 'Packaging Set', next30: 1200, next60: 2100, confidence: 'Low' },
    { sku: 'SC-1005', name: 'Motor Assembly', next30: 360, next60: 680, confidence: 'Medium' },
    { sku: 'SC-1006', name: 'Wiring Harness', next30: 980, next60: 1720, confidence: 'High' },
    { sku: 'SC-1007', name: 'Thermal Shield', next30: 260, next60: 520, confidence: 'Low' }
  ];

  const seasonality = [
    { month: 'Apr', trend: 'Rising', note: 'Retail promotions' },
    { month: 'May', trend: 'Stable', note: 'Component demand steady' },
    { month: 'Jun', trend: 'Peak', note: 'Holiday prep ramp' },
    { month: 'Jul', trend: 'Cooling', note: 'Post-peak normalization' }
  ];

  const safetyStock = [
    { location: 'Central Warehouse', sku: 'SC-1001', recommended: 220, current: 180 },
    { location: 'Northeast DC', sku: 'SC-1003', recommended: 140, current: 95 },
    { location: 'Austin Retail Hub', sku: 'SC-1004', recommended: 600, current: 520 }
  ];

  return (
    <Container fluid className="forecasting-page">
      <PageHeader title="Forecasting" />

      <Row className="mb-4">
        <Col lg={8} className="mb-4 mb-lg-0">
          <Card>
            <Card.Header>
              <h5 className="m-0 dashboard-section-title">Demand Forecasts</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover className="dashboard-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Product</th>
                    <th>Next 30 Days</th>
                    <th>Next 60 Days</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {demandForecast.map((item) => (
                    <tr key={item.sku}>
                      <td>{item.sku}</td>
                      <td>{item.name}</td>
                      <td>{item.next30}</td>
                      <td>{item.next60}</td>
                      <td>
                        <Badge bg={item.confidence === 'High' ? 'success' : item.confidence === 'Medium' ? 'warning' : 'danger'}>
                          {item.confidence}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="m-0 dashboard-section-title title-white">Seasonality Signals</h5>
            </Card.Header>
            <Card.Body className="seasonality-list">
              {seasonality.map((item) => (
                <div key={item.month} className="seasonality-item">
                  <div className="seasonality-top">
                    <span className="seasonality-month">{item.month}</span>
                    <Badge bg="info" className="seasonality-badge">{item.trend}</Badge>
                  </div>
                  <div className="seasonality-note">{item.note}</div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="m-0 dashboard-section-title">Safety Stock Suggestions</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover className="dashboard-table">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>SKU</th>
                    <th>Recommended</th>
                    <th>Current</th>
                  </tr>
                </thead>
                <tbody>
                  {safetyStock.map((item, index) => (
                    <tr key={`${item.location}-${index}`}>
                      <td>{item.location}</td>
                      <td>{item.sku}</td>
                      <td>{item.recommended}</td>
                      <td>{item.current}</td>
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

export default Forecasting;
