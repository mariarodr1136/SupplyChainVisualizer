import axios from 'axios';
import authHeader from './auth-header';

const API_URL = (process.env.REACT_APP_API_URL || '') + '/api/shipments/';

class ShipmentService {
  getAllShipments() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getShipmentById(id) {
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  createShipment(shipment) {
    return axios.post(API_URL, shipment, { headers: authHeader() });
  }

  updateShipment(id, shipment) {
    return axios.put(API_URL + id, shipment, { headers: authHeader() });
  }

  deleteShipment(id) {
    return axios.delete(API_URL + id, { headers: authHeader() });
  }

  updateShipmentStatus(id, status) {
    return axios.put(API_URL + 'status/' + id, null, {
      params: { status: status },
      headers: authHeader()
    });
  }

  getShipmentsBySource(sourceId) {
    return axios.get(API_URL + 'source/' + sourceId, { headers: authHeader() });
  }

  getShipmentsByDestination(destinationId) {
    return axios.get(API_URL + 'destination/' + destinationId, { headers: authHeader() });
  }

  getShipmentsByStatus(status) {
    return axios.get(API_URL + 'status/' + status, { headers: authHeader() });
  }

  getShipmentsByDateRange(startDate, endDate, dateType = 'departure') {
    return axios.get(API_URL + 'date-range', {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        dateType: dateType
      },
      headers: authHeader()
    });
  }
}

const shipmentService = new ShipmentService();
export default shipmentService;
