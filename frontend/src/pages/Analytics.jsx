import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, ProgressBar } from 'react-bootstrap';
import { FaDollarSign, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import AnalyticsService from '../services/analytics.service';

const costTrends = [
  { month: 'Oct', transport: 42000, warehousing: 18000, total: 60000 },
  { month: 'Nov', transport: 43800, warehousing: 19250, total: 63050 },
  { month: 'Dec', transport: 45500, warehousing: 20400, total: 65900 },
  { month: 'Jan', transport: 41200, warehousing: 18800, total: 60000 },
  { month: 'Feb', transport: 39800, warehousing: 17650, total: 57450 },
  { month: 'Mar', transport: 42100, warehousing: 18500, total: 60600 },
];

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AnalyticsService.getSummary()
      .then((res) => {
        setSummary(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load analytics data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container fluid className="analytics-page">
        <PageHeader title="Analytics" />
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="analytics-page">
        <PageHeader title="Analytics" />
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  const kpis = [
    {
      title: 'On-Time Delivery',
      value: summary ? `${summary.onTimeDeliveryRate}%` : '—',
      icon: <FaCheckCircle />,
      color: 'success',
    },
    {
      title: 'Avg Lead Time',
      value: summary ? `${summary.avgLeadTimeDays} days` : '—',
      icon: <FaClock />,
      color: 'info',
    },
    {
      title: 'Cost Per Shipment',
      value: '$1,240',
      icon: <FaDollarSign />,
      color: 'primary',
    },
    {
      title: 'Exception Rate',
      value: summary ? `${summary.exceptionRate}%` : '—',
      icon: <FaExclamationTriangle />,
      color: 'warning',
    },
  ];

  const slaByLane = summary?.slaByLane ?? [];
  const leadTimeBySegment = summary?.leadTimeBySegment ?? [];

  return (
    <Container fluid className="analytics-page">
      <PageHeader title="Analytics" />

      <Row className="mb-4">
        {kpis.map((kpi) => (
          <Col lg={3} md={6} sm={12} className="mb-4 mb-lg-0" key={kpi.title}>
            <StatCard title={kpi.title} value={kpi.value} icon={kpi.icon} color={kpi.color} />
          </Col>
        ))}
      </Row>

      <Row className="mb-4">
        <Col lg={7} className="mb-4 mb-lg-0">
          <Card className="h-100 analytics-card">
            <Card.Header>
              <h5 className="m-0 dashboard-section-title">Cost Trends</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover className="dashboard-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Transport</th>
                    <th>Warehousing</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {costTrends.map((row) => (
                    <tr key={row.month}>
                      <td>{row.month}</td>
                      <td>${row.transport.toLocaleString()}</td>
                      <td>${row.warehousing.toLocaleString()}</td>
                      <td>${row.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="h-100 analytics-card">
            <Card.Header>
              <h5 className="m-0 dashboard-section-title title-white">SLA Performance</h5>
            </Card.Header>
            <Card.Body className="sla-list">
              {slaByLane.length === 0 ? (
                <p className="text-muted text-center mt-3">No delivered shipments yet</p>
              ) : (
                slaByLane.map((lane) => (
                  <div key={lane.lane} className="sla-item">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="sla-label">{lane.lane}</span>
                      <span className="sla-value">{lane.slaRate}%</span>
                    </div>
                    <ProgressBar
                      now={lane.slaRate}
                      variant={lane.slaRate >= 95 ? 'success' : 'info'}
                    />
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="m-0 dashboard-section-title">Lead-Time Variance</h5>
            </Card.Header>
            <Card.Body>
              {leadTimeBySegment.length === 0 ? (
                <p className="text-muted text-center">No delivered shipments with full date data yet</p>
              ) : (
                <Table responsive hover className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Segment</th>
                      <th>Target (days)</th>
                      <th>Actual (days)</th>
                      <th>Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadTimeBySegment.map((row) => (
                      <tr key={row.segment}>
                        <td>{row.segment}</td>
                        <td>{row.targetDays}</td>
                        <td>{row.actualDays}</td>
                        <td>{row.variance}</td>
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

export default Analytics;
