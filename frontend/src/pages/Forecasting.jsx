import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import PageHeader from '../components/common/PageHeader';
import InventoryService from '../services/inventory.service';
import ProductService from '../services/product.service';

const seasonality = [
  { month: 'Apr', trend: 'Rising', note: 'Retail promotions' },
  { month: 'May', trend: 'Stable', note: 'Component demand steady' },
  { month: 'Jun', trend: 'Peak', note: 'Holiday prep ramp' },
  { month: 'Jul', trend: 'Cooling', note: 'Post-peak normalization' },
];

const confidenceForItem = (quantity, minThreshold) => {
  if (!minThreshold) return 'Medium';
  if (quantity >= minThreshold * 2) return 'High';
  if (quantity >= minThreshold) return 'Medium';
  return 'Low';
};

const buildDemandForecast = (allInventory, products) => {
  const productMap = {};
  products.forEach((p) => {
    productMap[p.id] = p;
  });

  const byProduct = {};
  allInventory.forEach((item) => {
    if (!byProduct[item.productId]) {
      byProduct[item.productId] = {
        sku: productMap[item.productId]?.sku || `P-${item.productId}`,
        name: item.productName,
        totalQty: 0,
        totalMin: 0,
        count: 0,
      };
    }
    byProduct[item.productId].totalQty += item.quantity || 0;
    byProduct[item.productId].totalMin += item.minThreshold || 0;
    byProduct[item.productId].count += 1;
  });

  return Object.entries(byProduct).map(([, agg]) => {
    const avgQty = agg.totalQty / agg.count;
    const avgMin = agg.totalMin / agg.count;
    return {
      sku: agg.sku,
      name: agg.name,
      next30: Math.round(avgMin * 1.2),
      next60: Math.round(avgMin * 2.1),
      confidence: confidenceForItem(avgQty, avgMin),
    };
  });
};

const Forecasting = () => {
  const [demandForecast, setDemandForecast] = useState([]);
  const [safetyStock, setSafetyStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      InventoryService.getAllInventory(),
      InventoryService.getLowStockInventory(),
      ProductService.getAllProducts(),
    ])
      .then(([allInvRes, lowStockRes, productsRes]) => {
        const allInventory = allInvRes.data;
        const lowStock = lowStockRes.data;
        const products = productsRes.data;

        setDemandForecast(buildDemandForecast(allInventory, products));
        setSafetyStock(
          lowStock.map((item) => ({
            location: item.nodeName,
            sku: products.find((p) => p.id === item.productId)?.sku || `P-${item.productId}`,
            recommended: item.minThreshold,
            current: item.quantity,
          }))
        );
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load forecasting data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container fluid className="forecasting-page">
        <PageHeader title="Forecasting" />
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
      <Container fluid className="forecasting-page">
        <PageHeader title="Forecasting" />
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container fluid className="forecasting-page">
      <PageHeader
        title="Forecasting"
        subtitle="Heuristic projections from current inventory levels — seasonal trend notes are illustrative"
      />

      <Row className="mb-4">
        <Col lg={8} className="mb-4 mb-lg-0">
          <Card>
            <Card.Header>
              <h5 className="m-0 dashboard-section-title">Demand Forecasts</h5>
            </Card.Header>
            <Card.Body>
              {demandForecast.length === 0 ? (
                <p className="text-muted text-center">No inventory data available</p>
              ) : (
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
                          <Badge
                            bg={
                              item.confidence === 'High'
                                ? 'success'
                                : item.confidence === 'Medium'
                                ? 'warning'
                                : 'danger'
                            }
                          >
                            {item.confidence}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
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
                    <Badge bg="info" className="seasonality-badge">
                      {item.trend}
                    </Badge>
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
              {safetyStock.length === 0 ? (
                <p className="text-muted text-center">All inventory levels are healthy</p>
              ) : (
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
                        <td>
                          <span className={item.current < item.recommended ? 'text-danger fw-bold' : ''}>
                            {item.current}
                          </span>
                        </td>
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

export default Forecasting;
