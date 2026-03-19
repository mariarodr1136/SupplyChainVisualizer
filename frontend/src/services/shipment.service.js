import axios from 'axios';
import authHeader from './auth-header';
import { isGuestUser } from './guest-utils';
import { guestDataApi } from '../data/guestData';

const API_URL = (process.env.REACT_APP_API_URL || '') + '/api/shipments/';

class ShipmentService {
  getAllShipments() {
    if (isGuestUser()) {
      return Promise.resolve({ data: guestDataApi.getShipments() });
    }
    return axios.get(API_URL, { headers: authHeader() });
  }

  getShipmentById(id) {
    if (isGuestUser()) {
      return Promise.resolve({ data: guestDataApi.getShipmentById(id) });
    }
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  createShipment(shipment) {
    if (isGuestUser()) {
      return Promise.resolve({ data: guestDataApi.createShipment(shipment) });
    }
    return axios.post(API_URL, shipment, { headers: authHeader() });
  }

  updateShipment(id, shipment) {
    if (isGuestUser()) {
      return Promise.resolve({ data: guestDataApi.updateShipment(id, shipment) });
    }
    return axios.put(API_URL + id, shipment, { headers: authHeader() });
  }

  deleteShipment(id) {
    if (isGuestUser()) {
      return Promise.resolve({ data: guestDataApi.deleteShipment(id) });
    }
    return axios.delete(API_URL + id, { headers: authHeader() });
  }

  updateShipmentStatus(id, status) {
    if (isGuestUser()) {
      return Promise.resolve({ data: guestDataApi.updateShipmentStatus(id, status) });
    }
    return axios.put(API_URL + 'status/' + id, null, {
      params: { status: status },
      headers: authHeader()
    });
  }

  getShipmentsBySource(sourceId) {
    if (isGuestUser()) {
      return Promise.resolve({
        data: guestDataApi
          .getShipments()
          .filter((shipment) => shipment.sourceId === Number(sourceId))
      });
    }
    return axios.get(API_URL + 'source/' + sourceId, { headers: authHeader() });
  }

  getShipmentsByDestination(destinationId) {
    if (isGuestUser()) {
      return Promise.resolve({
        data: guestDataApi
          .getShipments()
          .filter((shipment) => shipment.destinationId === Number(destinationId))
      });
    }
    return axios.get(API_URL + 'destination/' + destinationId, { headers: authHeader() });
  }

  getShipmentsByStatus(status) {
    if (isGuestUser()) {
      return Promise.resolve({
        data: guestDataApi.getShipments().filter((shipment) => shipment.status === status)
      });
    }
    return axios.get(API_URL + 'status/' + status, { headers: authHeader() });
  }

  getShipmentsByDateRange(startDate, endDate, dateType = 'departure') {
    if (isGuestUser()) {
      const start = startDate?.getTime?.() ?? 0;
      const end = endDate?.getTime?.() ?? Number.POSITIVE_INFINITY;
      const field = dateType === 'arrival' ? 'estimatedArrival' : 'departureDate';
      return Promise.resolve({
        data: guestDataApi.getShipments().filter((shipment) => {
          const value = shipment[field] ? new Date(shipment[field]).getTime() : null;
          return value !== null && value >= start && value <= end;
        })
      });
    }
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
