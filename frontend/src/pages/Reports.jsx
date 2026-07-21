import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { FaFileDownload, FaTruck, FaBoxes, FaShoppingCart, FaExclamationTriangle } from 'react-icons/fa';
import ShipmentService from '../services/shipment.service';
import InventoryService from '../services/inventory.service';
import ProductService from '../services/product.service';
import PageHeader from '../components/common/PageHeader';
import './Reports.css';

// Turns an array of flat objects into a downloadable CSV file.
const downloadCsv = (filename, rows) => {
  if (!rows || rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const escapeCell = (value) => {
    const str = value === null || value === undefined ? '' : String(value);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const csv = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escapeCell(row[h])).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const Reports = () => {
  const [shipments, setShipments] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [shipmentsRes, inventoryRes, lowStockRes, productsRes] = await Promise.all([
        ShipmentService.getAllShipments(),
        InventoryService.getAllInventory(),
        InventoryService.getLowStockInventory(),
        ProductService.getAllProducts(),
      ]);

      setShipments(shipmentsRes.data);
      setInventory(inventoryRes.data);
      setLowStock(lowStockRes.data);
      setProducts(productsRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load report data');
      setLoading(false);
      console.error(err);
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  const reports = [
    {
      key: 'shipments',
      title: 'Shipments',
      icon: <FaTruck />,
      description: 'Every shipment with route, status, and key dates.',
      count: shipments.length,
      onExport: () =>
        downloadCsv(
          `shipments-${today}.csv`,
          shipments.map((s) => ({
            id: s.id,
            status: s.status,
            source: s.sourceName,
            destination: s.destinationName,
            createdAt: s.createdAt,
            departureDate: s.departureDate,
            estimatedArrival: s.estimatedArrival,
          }))
        ),
    },
    {
      key: 'inventory',
      title: 'Inventory',
      icon: <FaBoxes />,
      description: 'Full stock levels across every node and product.',
      count: inventory.length,
      onExport: () =>
        downloadCsv(
          `inventory-${today}.csv`,
          inventory.map((i) => ({
            id: i.id,
            product: i.productName,
            node: i.nodeName,
            quantity: i.quantity,
            minThreshold: i.minThreshold,
            maxThreshold: i.maxThreshold,
            status: i.status,
            updatedAt: i.updatedAt,
          }))
        ),
    },
    {
      key: 'low-stock',
      title: 'Low Stock Alert',
      icon: <FaExclamationTriangle />,
      description: 'Items currently at or below their reorder threshold.',
      count: lowStock.length,
      onExport: () =>
        downloadCsv(
          `low-stock-${today}.csv`,
          lowStock.map((i) => ({
            id: i.id,
            product: i.productName,
            node: i.nodeName,
            quantity: i.quantity,
            minThreshold: i.minThreshold,
            status: i.status,
          }))
        ),
    },
    {
      key: 'products',
      title: 'Product Catalog',
      icon: <FaShoppingCart />,
      description: 'SKU, category, weight, and price for every product.',
      count: products.length,
      onExport: () =>
        downloadCsv(
          `products-${today}.csv`,
          products.map((p) => ({
            sku: p.sku,
            name: p.name,
            category: p.category,
            weight: p.weight,
            price: p.price,
          }))
        ),
    },
  ];

  if (loading) {
    return (
      <Container>
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading report data...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="my-5">
          <Alert variant="danger">
            <Alert.Heading>Error Loading Reports</Alert.Heading>
            <p>{error}</p>
            <Button variant="outline-danger" onClick={loadReportsData}>Try Again</Button>
          </Alert>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="reports-page">
      <PageHeader title="Reports" subtitle="Export current data as CSV for offline analysis" />

      <Row className="g-3">
        {reports.map((report) => (
          <Col xl={3} md={6} xs={12} key={report.key}>
            <Card className="report-card h-100">
              <Card.Body className="d-flex flex-column align-items-center text-center">
                <div className="report-card-icon">{report.icon}</div>
                <h5 className="report-card-title">{report.title}</h5>
                <p className="report-card-desc flex-grow-1">{report.description}</p>
                <div className="report-card-footer">
                  <span className="report-card-count">{report.count} records</span>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    disabled={report.count === 0}
                    onClick={report.onExport}
                  >
                    <FaFileDownload className="me-2" /> Export CSV
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Reports;
