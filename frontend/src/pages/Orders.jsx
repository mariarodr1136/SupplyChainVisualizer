import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import PageHeader from '../components/common/PageHeader';

const Orders = () => {
  const orders = [
    { id: 'PO-8473', type: 'Purchase', status: 'Pending', value: '$124,500', updated: '2 hrs ago' },
    { id: 'SO-2198', type: 'Sales', status: 'In Fulfillment', value: '$42,300', updated: '5 hrs ago' },
    { id: 'PO-8461', type: 'Purchase', status: 'Approved', value: '$86,900', updated: '1 day ago' },
    { id: 'SO-2182', type: 'Sales', status: 'Shipped', value: '$18,750', updated: '1 day ago' },
    { id: 'SO-2173', type: 'Sales', status: 'Delivered', value: '$63,100', updated: '2 days ago' }
  ];

  const statusVariant = (status) => {
    if (status === 'Pending') return 'warning';
    if (status === 'Approved') return 'info';
    if (status === 'In Fulfillment') return 'primary';
    if (status === 'Shipped') return 'secondary';
    if (status === 'Delivered') return 'success';
    return 'light';
  };

  return (
    <Container fluid className="orders-page">
      <PageHeader title="Orders" />

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="m-0 dashboard-section-title">Order Lifecycle</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover className="dashboard-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Value</th>
                    <th>Last Update</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.type}</td>
                      <td>
                        <Badge bg={statusVariant(order.status)}>{order.status}</Badge>
                      </td>
                      <td>{order.value}</td>
                      <td>{order.updated}</td>
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

export default Orders;
