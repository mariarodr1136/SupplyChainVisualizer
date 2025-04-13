import React from 'react';
import { Modal, Button, Badge, Table } from 'react-bootstrap';
import { FaPrint, FaRegCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './ShipmentDetailsModal.css';

const ShipmentDetailsModal = ({ show, onHide, shipment, onUpdateStatus }) => {
  if (!shipment) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'in_transit':
        return <Badge bg="info">In Transit</Badge>;
      case 'delivered':
        return <Badge bg="success">Delivered</Badge>;
      case 'delayed':
        return <Badge bg="danger">Delayed</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const handleUpdateStatus = (newStatus) => {
    if (onUpdateStatus) {
      onUpdateStatus(shipment.id, newStatus);
    }
  };

  const getStatusButtons = () => {
    switch (shipment.status) {
      case 'pending':
        return (
          <Button 
            variant="primary" 
            onClick={() => handleUpdateStatus('in_transit')}
            className="me-2"
          >
            Mark as In Transit
          </Button>
        );
      case 'in_transit':
        return (
          <>
            <Button 
              variant="success" 
              onClick={() => handleUpdateStatus('delivered')}
              className="me-2"
            >
              <FaRegCheckCircle className="me-1" /> Mark as Delivered
            </Button>
            <Button 
              variant="danger" 
              onClick={() => handleUpdateStatus('delayed')}
            >
              <FaExclamationTriangle className="me-1" /> Mark as Delayed
            </Button>
          </>
        );
      case 'delayed':
        return (
          <Button 
            variant="success" 
            onClick={() => handleUpdateStatus('delivered')}
          >
            <FaRegCheckCircle className="me-1" /> Mark as Delivered
          </Button>
        );
      case 'delivered':
        return null;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Shipment Details - #{shipment.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="shipment-header mb-4">
          <div className="shipment-status">
            <h5>Status: {getStatusBadge(shipment.status)}</h5>
          </div>
          
          <div className="shipment-route">
            <div className="route-item">
              <div className="route-label">From:</div>
              <div className="route-value">
                <Link to={`/nodes/${shipment.sourceId}`}>
                  {shipment.sourceName}
                </Link>
              </div>
            </div>
            <div className="route-arrow">→</div>
            <div className="route-item">
              <div className="route-label">To:</div>
              <div className="route-value">
                <Link to={`/nodes/${shipment.destinationId}`}>
                  {shipment.destinationName}
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="shipment-dates mb-4">
          <div className="row">
            <div className="col-md-4">
              <div className="date-item">
                <div className="date-label">Created</div>
                <div className="date-value">{formatDate(shipment.createdAt)}</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="date-item">
                <div className="date-label">Departure</div>
                <div className="date-value">{formatDate(shipment.departureDate)}</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="date-item">
                <div className="date-label">Expected Arrival</div>
                <div className="date-value">{formatDate(shipment.estimatedArrival)}</div>
              </div>
            </div>
          </div>
          
          {shipment.status === 'delivered' && (
            <div className="row mt-3">
              <div className="col-md-12">
                <div className="date-item delivered-date">
                  <div className="date-label">Actual Delivery</div>
                  <div className="date-value">{formatDate(shipment.actualArrival)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <h5>Shipment Items</h5>
        <Table responsive bordered hover className="mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {shipment.items && shipment.items.length > 0 ? (
              shipment.items.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{index + 1}</td>
                  <td>
                    <Link to={`/products/${item.productId}`}>
                      {item.productName}
                    </Link>
                  </td>
                  <td>{item.quantity}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">No items in this shipment</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-between w-100">
          <div>
            {getStatusButtons()}
          </div>
          <div>
            <Button variant="outline-secondary" onClick={onHide} className="me-2">
              Close
            </Button>
            <Button variant="outline-secondary">
              <FaPrint className="me-1" /> Print
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ShipmentDetailsModal;