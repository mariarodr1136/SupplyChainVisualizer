import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaBoxes, FaTruck, FaExclamationTriangle, FaCheckCircle, FaNetworkWired } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import NodeService from '../services/node.service';
import ShipmentService from '../services/shipment.service';
import InventoryService from '../services/inventory.service';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import './Dashboard.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [nodes, setNodes] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const nodesResponse = await NodeService.getAllNodes();
        const shipmentsResponse = await ShipmentService.getAllShipments();
        const lowStockResponse = await InventoryService.getLowStockInventory();
        
        setNodes(nodesResponse.data);
        setShipments(shipmentsResponse.data);
        setLowStockItems(lowStockResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate statistics
  const activeNodes = nodes.filter(node => node.status === 'active').length;
  const pendingShipments = shipments.filter(shipment => shipment.status === 'pending').length;
  const inTransitShipments = shipments.filter(shipment => shipment.status === 'in_transit').length;
  const deliveredShipments = shipments.filter(shipment => shipment.status === 'delivered').length;
  const delayedShipments = shipments.filter(shipment => shipment.status === 'delayed').length;

  // Prepare chart data
  const recentMonths = getRecentMonths(6);
  
  const shipmentStatusData = {
    labels: ['Pending', 'In Transit', 'Delivered', 'Delayed'],
    datasets: [
      {
        label: 'Shipment Status',
        data: [pendingShipments, inTransitShipments, deliveredShipments, delayedShipments],
        backgroundColor: [
          'rgba(255, 206, 86, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Mock data for shipment trends - in a real app, you would get this from the API
  const shipmentTrendsData = {
    labels: recentMonths,
    datasets: [
      {
        label: 'Shipments',
        data: [65, 78, 90, 85, 95, 110],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // If loading, show a loading indicator
  if (loading) {
    return (
      <Container>
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading dashboard data...</p>
        </div>
      </Container>
    );
  }

  // If there's an error, show the error message
  if (error) {
    return (
      <Container>
        <div className="text-center my-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <PageHeader title="Dashboard" />

      {/* Stats */}
      <Row className="mb-4">
        <Col lg={3} md={6} sm={12} className="mb-4 mb-lg-0">
          <StatCard
            title="Active Locations"
            value={activeNodes}
            icon={<FaNetworkWired />}
            color="primary"
          />
        </Col>
        <Col lg={3} md={6} sm={12} className="mb-4 mb-lg-0">
          <StatCard
            title="In Transit Shipments"
            value={inTransitShipments}
            icon={<FaTruck />}
            color="info"
          />
        </Col>
        <Col lg={3} md={6} sm={12} className="mb-4 mb-lg-0">
          <StatCard
            title="Delivered Shipments"
            value={deliveredShipments}
            icon={<FaCheckCircle />}
            color="success"
          />
        </Col>
        <Col lg={3} md={6} sm={12} className="mb-4 mb-lg-0">
          <StatCard
            title="Low Stock Alerts"
            value={lowStockItems.length}
            icon={<FaExclamationTriangle />}
            color="danger"
          />
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col lg={6} className="mb-4 mb-lg-0">
          <Card>
            <Card.Header>
              <h5 className="m-0">Shipment Status</h5>
            </Card.Header>
            <Card.Body>
              <Bar data={shipmentStatusData} options={{ responsive: true }} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5 className="m-0">Shipment Trends (Last 6 Months)</h5>
            </Card.Header>
            <Card.Body>
              <Line data={shipmentTrendsData} options={{ responsive: true }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Low Stock Alerts */}
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="m-0">Low Stock Alerts</h5>
              <Link to="/inventory" className="btn btn-sm btn-primary">View All</Link>
            </Card.Header>
            <Card.Body>
              {lowStockItems.length === 0 ? (
                <p className="text-center text-muted">No low stock alerts</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Location</th>
                        <th>Product</th>
                        <th>Current Stock</th>
                        <th>Minimum Threshold</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockItems.slice(0, 5).map((item) => (
                        <tr key={item.id}>
                          <td>{item.nodeName}</td>
                          <td>{item.productName}</td>
                          <td>{item.quantity}</td>
                          <td>{item.minThreshold}</td>
                          <td>
                            <span className="badge bg-danger">Low Stock</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Helper function to get recent months
function getRecentMonths(count) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const result = [];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  
  for (let i = count - 1; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    result.push(months[monthIndex]);
  }
  
  return result;
}

export default Dashboard;