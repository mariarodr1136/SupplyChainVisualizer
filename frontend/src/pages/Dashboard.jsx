import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge } from 'react-bootstrap';
import {
  FaTruck,
  FaExclamationTriangle,
  FaCheckCircle,
  FaNetworkWired,
  FaClock,
  FaPercentage,
  FaProjectDiagram,
  FaBoxOpen,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import NodeService from '../services/node.service';
import ShipmentService from '../services/shipment.service';
import InventoryService from '../services/inventory.service';
import ConnectionService from '../services/connection.service';
import AnalyticsService from '../services/analytics.service';
import StatCard from '../components/common/StatCard';
import './Dashboard.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Global chart styling for dark theme
ChartJS.defaults.color = '#9c9c9c';
ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.06)';
ChartJS.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const SHIPMENT_STATUS_META = {
  pending: { label: 'Pending', color: '#fbbf24', badge: 'warning', verb: 'created' },
  in_transit: { label: 'In Transit', color: '#38bdf8', badge: 'info', verb: 'departed' },
  delivered: { label: 'Delivered', color: '#34d399', badge: 'success', verb: 'delivered' },
  delayed: { label: 'Delayed', color: '#f87171', badge: 'danger', verb: 'delayed' },
};
const SHIPMENT_STATUS_ORDER = ['pending', 'in_transit', 'delivered', 'delayed'];

const INVENTORY_STATUS_META = {
  optimal: { label: 'Optimal', color: '#34d399', badge: 'success' },
  low: { label: 'Low', color: '#fbbf24', badge: 'warning' },
  critical: { label: 'Critical', color: '#f87171', badge: 'danger' },
  excess: { label: 'Excess', color: '#38bdf8', badge: 'info' },
};
const INVENTORY_STATUS_ORDER = ['optimal', 'low', 'critical', 'excess'];

const NODE_TYPE_LABELS = {
  factory: 'Factories',
  warehouse: 'Warehouses',
  store: 'Stores',
  supplier: 'Suppliers',
};

function formatRelativeTime(dateStr) {
  if (!dateStr) return '—';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  if (diffMs < 60000) return 'just now';
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  const diffMonth = Math.round(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return `${Math.round(diffDay / 365)}y ago`;
}

const Dashboard = () => {
  const [nodes, setNodes] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [connections, setConnections] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [nodesRes, shipmentsRes, inventoryRes, lowStockRes, connectionsRes, summaryRes] =
          await Promise.all([
            NodeService.getAllNodes(),
            ShipmentService.getAllShipments(),
            InventoryService.getAllInventory(),
            InventoryService.getLowStockInventory(),
            ConnectionService.getAllConnections(),
            AnalyticsService.getSummary(),
          ]);

        setNodes(nodesRes.data);
        setShipments(shipmentsRes.data);
        setInventory(inventoryRes.data);
        setLowStockItems(lowStockRes.data);
        setConnections(connectionsRes.data);
        setSummary(summaryRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchDashboardData();
  }, []);

  // ── Core counts ──────────────────────────────────────
  const activeNodes = nodes.filter((node) => node.status === 'active').length;
  const shipmentStatusCounts = SHIPMENT_STATUS_ORDER.reduce((acc, s) => {
    acc[s] = shipments.filter((shipment) => shipment.status === s).length;
    return acc;
  }, {});
  const totalShipments = shipments.length;

  const inventoryStatusCounts = INVENTORY_STATUS_ORDER.reduce((acc, s) => {
    acc[s] = inventory.filter((item) => item.status === s).length;
    return acc;
  }, {});

  const connectionStatusCounts = connections.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  const nodeTypeCounts = nodes.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
  }, {});
  const maxNodeTypeCount = Math.max(1, ...Object.values(nodeTypeCounts));

  // Node capacity utilization — inventory on hand vs. node capacity
  const inventoryByNode = inventory.reduce((acc, item) => {
    acc[item.nodeId] = (acc[item.nodeId] || 0) + (item.quantity || 0);
    return acc;
  }, {});
  const nodeUtilization = nodes
    .map((n) => ({
      id: n.id,
      name: n.name,
      utilization: n.capacity
        ? Math.min(100, Math.round(((inventoryByNode[n.id] || 0) / n.capacity) * 1000) / 10)
        : 0,
    }))
    .sort((a, b) => b.utilization - a.utilization)
    .slice(0, 5);

  // Recent activity feed — merges shipment and inventory events
  const recentActivity = [
    ...shipments.map((s) => ({
      key: `shipment-${s.id}`,
      timestamp: s.createdAt,
      icon: <FaTruck />,
      color: SHIPMENT_STATUS_META[s.status]?.color || '#9c9c9c',
      title: `Shipment #${s.id} ${SHIPMENT_STATUS_META[s.status]?.verb || 'updated'}`,
      detail: `${s.sourceName} → ${s.destinationName}`,
    })),
    ...inventory.map((i) => ({
      key: `inventory-${i.id}`,
      timestamp: i.updatedAt,
      icon: <FaBoxOpen />,
      color: INVENTORY_STATUS_META[i.status]?.color || '#9c9c9c',
      title: `${i.productName} updated at ${i.nodeName}`,
      detail: `${i.quantity} units on hand · ${INVENTORY_STATUS_META[i.status]?.label || i.status}`,
    })),
  ]
    .filter((a) => a.timestamp)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 9);

  // ── Chart data ────────────────────────────────────────
  const recentMonths = getRecentMonths(6);

  const darkTooltip = {
    backgroundColor: 'rgba(24, 22, 19, 0.94)',
    titleColor: '#f5f5f5',
    bodyColor: '#9c9c9c',
    borderColor: 'rgba(255, 255, 255, 0.09)',
    borderWidth: 1,
    padding: 10,
    cornerRadius: 8,
    displayColors: false,
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: darkTooltip,
    },
  };

  const shipmentStatusDonut = {
    labels: SHIPMENT_STATUS_ORDER.map((s) => SHIPMENT_STATUS_META[s].label),
    datasets: [
      {
        data: SHIPMENT_STATUS_ORDER.map((s) => shipmentStatusCounts[s]),
        backgroundColor: SHIPMENT_STATUS_ORDER.map((s) => SHIPMENT_STATUS_META[s].color),
        borderColor: '#1a1815',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const inventoryHealthDonut = {
    labels: INVENTORY_STATUS_ORDER.map((s) => INVENTORY_STATUS_META[s].label),
    datasets: [
      {
        data: INVENTORY_STATUS_ORDER.map((s) => inventoryStatusCounts[s]),
        backgroundColor: INVENTORY_STATUS_ORDER.map((s) => INVENTORY_STATUS_META[s].color),
        borderColor: '#1a1815',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const chartTickColor = '#9c9c9c';
  const chartGridColor = 'rgba(255, 255, 255, 0.06)';

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: darkTooltip,
    },
    scales: {
      x: {
        ticks: { color: chartTickColor },
        grid: { display: false },
        border: { color: chartGridColor },
      },
      y: {
        beginAtZero: true,
        grace: 1,
        ticks: { color: chartTickColor, precision: 0 },
        grid: { color: chartGridColor },
        border: { display: false },
      },
    },
  };

  // Count shipments by departure month from real data
  const now = new Date();
  const monthlyShipmentCounts = recentMonths.map((_, i) => {
    const offset = 5 - i;
    const targetDate = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const targetMonth = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();
    return shipments.filter((s) => {
      if (!s.departureDate) return false;
      const d = new Date(s.departureDate);
      return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
    }).length;
  });

  const shipmentTrendsData = {
    labels: recentMonths,
    datasets: [
      {
        label: 'Shipments',
        data: monthlyShipmentCounts,
        fill: true,
        backgroundColor: 'rgba(246, 90, 36, 0.12)',
        borderColor: '#f65a24',
        borderWidth: 2,
        pointRadius: 3.5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#f65a24',
        pointBorderColor: '#131110',
        pointBorderWidth: 2,
        tension: 0.35,
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

  const snapshot = [
    {
      label: 'On-Time Delivery',
      value: summary ? `${summary.onTimeDeliveryRate}%` : '—',
      icon: <FaPercentage />,
    },
    {
      label: 'Avg Lead Time',
      value: summary ? `${summary.avgLeadTimeDays}d` : '—',
      icon: <FaClock />,
    },
    {
      label: 'Exception Rate',
      value: summary ? `${summary.exceptionRate}%` : '—',
      icon: <FaExclamationTriangle />,
    },
    {
      label: 'Active Connections',
      value: connectionStatusCounts.active || 0,
      icon: <FaProjectDiagram />,
    },
  ];

  const donutCard = (title, data, centerValue, centerLabel, order, meta, counts) => (
    <Card className="h-100">
      <Card.Header>
        <h5 className="m-0 dashboard-section-title">{title}</h5>
      </Card.Header>
      <Card.Body className="donut-card-body">
        <div className="donut-layout">
          <div className="dashboard-chart-wrap dashboard-chart-wrap--donut">
            <Doughnut data={data} options={donutOptions} />
            <div className="donut-center">
              <span className="donut-center-value">{centerValue}</span>
              <span className="donut-center-label">{centerLabel}</span>
            </div>
          </div>
          <div className="donut-legend">
            {order.map((s) => (
              <div key={s} className="donut-legend-row">
                <span className="donut-legend-dot" style={{ background: meta[s].color }} />
                <span className="donut-legend-label">{meta[s].label}</span>
                <span className="donut-legend-value">{counts[s]}</span>
              </div>
            ))}
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="dashboard-page">
      {/* Primary stats */}
      <Row className="g-3 mb-3">
        <Col xl={3} md={6} xs={12}>
          <StatCard
            title="Active Locations"
            value={activeNodes}
            icon={<FaNetworkWired />}
            color="info"
          />
        </Col>
        <Col xl={3} md={6} xs={12}>
          <StatCard
            title="In Transit Shipments"
            value={shipmentStatusCounts.in_transit}
            icon={<FaTruck />}
            color="purple"
          />
        </Col>
        <Col xl={3} md={6} xs={12}>
          <StatCard
            title="Delivered Shipments"
            value={shipmentStatusCounts.delivered}
            icon={<FaCheckCircle />}
            color="success"
          />
        </Col>
        <Col xl={3} md={6} xs={12}>
          <StatCard
            title="Low Stock Alerts"
            value={lowStockItems.length}
            icon={<FaExclamationTriangle />}
            color="warning"
          />
        </Col>
      </Row>

      {/* Shipments: trend + status breakdown */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="m-0 dashboard-section-title">Shipment Trends (Last 6 Months)</h5>
            </Card.Header>
            <Card.Body className="d-flex flex-column dashboard-chart-card-body">
              <div className="dashboard-chart-wrap dashboard-chart-wrap--line">
                <Line data={shipmentTrendsData} options={lineChartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          {donutCard(
            'Shipment Status',
            shipmentStatusDonut,
            totalShipments,
            'Total',
            SHIPMENT_STATUS_ORDER,
            SHIPMENT_STATUS_META,
            shipmentStatusCounts
          )}
        </Col>
      </Row>

      {/* Performance snapshot strip */}
      <div className="kpi-strip mb-4">
        {snapshot.map((k) => (
          <div key={k.label} className="kpi-chip">
            <span className="kpi-chip-icon">{k.icon}</span>
            <div>
              <div className="kpi-chip-value">{k.value}</div>
              <div className="kpi-chip-label">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Inventory: health breakdown + low stock */}
      <Row className="g-4 mb-4">
        <Col lg={4}>
          {donutCard(
            'Inventory Health',
            inventoryHealthDonut,
            inventory.length,
            'SKUs',
            INVENTORY_STATUS_ORDER,
            INVENTORY_STATUS_META,
            inventoryStatusCounts
          )}
        </Col>
        <Col lg={8}>
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="m-0 dashboard-section-title">Low Stock Alerts</h5>
              <Link to="/inventory" className="btn btn-sm btn-primary">View All</Link>
            </Card.Header>
            <Card.Body>
              {lowStockItems.length === 0 ? (
                <p className="text-center text-muted">No low stock alerts</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover dashboard-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Stock Level</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockItems.slice(0, 5).map((item) => {
                        const pct = item.minThreshold
                          ? Math.min(100, Math.round((item.quantity / item.minThreshold) * 100))
                          : 0;
                        const meta = INVENTORY_STATUS_META[item.status] || INVENTORY_STATUS_META.low;
                        return (
                          <tr key={item.id}>
                            <td>
                              <div className="stock-product">{item.productName}</div>
                              <div className="stock-location">{item.nodeName}</div>
                            </td>
                            <td className="stock-level-col">
                              <div className="stock-cell">
                                <ProgressBar now={pct} variant={meta.badge} className="dashboard-progress stock-bar" />
                                <span className="stock-cell-text">{item.quantity} / {item.minThreshold}</span>
                              </div>
                            </td>
                            <td>
                              <Badge bg={meta.badge}>{meta.label}</Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Network health + activity feed */}
      <Row className="g-4">
        <Col lg={5} className="d-flex flex-column gap-4">
          <Card>
            <Card.Header>
              <h5 className="m-0 dashboard-section-title">Network Overview</h5>
            </Card.Header>
            <Card.Body className="card-body--padded">
              <div className="network-type-list">
                {Object.entries(nodeTypeCounts).map(([type, count]) => (
                  <div key={type} className="network-type-row">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="network-type-label">{NODE_TYPE_LABELS[type] || type}</span>
                      <span className="network-type-value">{count}</span>
                    </div>
                    <ProgressBar
                      now={(count / maxNodeTypeCount) * 100}
                      className="dashboard-progress"
                    />
                  </div>
                ))}
              </div>
              <div className="connection-chip-row">
                {Object.entries(connectionStatusCounts).map(([status, count]) => (
                  <span key={status} className={`connection-chip connection-chip--${status}`}>
                    {count} {status.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </Card.Body>
          </Card>
          <Card className="flex-grow-1">
            <Card.Header>
              <h5 className="m-0 dashboard-section-title">Node Capacity Utilization</h5>
            </Card.Header>
            <Card.Body className="card-body--padded">
              {nodeUtilization.map((n) => (
                <div key={n.id} className="utilization-row">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="utilization-label">{n.name}</span>
                    <span className="utilization-value">{n.utilization}%</span>
                  </div>
                  <ProgressBar
                    now={n.utilization}
                    variant={n.utilization >= 90 ? 'danger' : n.utilization >= 70 ? 'warning' : 'success'}
                    className="dashboard-progress"
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={7}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="m-0 dashboard-section-title">Recent Activity</h5>
            </Card.Header>
            <Card.Body className="card-body--padded">
              {recentActivity.length === 0 ? (
                <p className="text-center text-muted">No recent activity</p>
              ) : (
                <div className="activity-feed">
                  {recentActivity.map((a) => (
                    <div key={a.key} className="activity-row">
                      <span className="activity-icon" style={{ color: a.color, borderColor: a.color }}>
                        {a.icon}
                      </span>
                      <div className="activity-body">
                        <div className="activity-title">{a.title}</div>
                        <div className="activity-detail">{a.detail}</div>
                      </div>
                      <span className="activity-time">{formatRelativeTime(a.timestamp)}</span>
                    </div>
                  ))}
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
