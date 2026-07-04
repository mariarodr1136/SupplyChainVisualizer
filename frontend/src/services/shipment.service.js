import axios from 'axios';
import authHeader from './auth-header';
import { guestOr } from './guest-utils';
import { guestDataApi } from '../data/guestData';

const API_URL = (import.meta.env.VITE_API_URL || '') + '/api/shipments/';

class ShipmentService {
  getAllShipments() {
    return guestOr(
      () => guestDataApi.getShipments(),
      () => axios.get(API_URL, { headers: authHeader() })
    );
  }

  getShipmentById(id) {
    return guestOr(
      () => guestDataApi.getShipmentById(id),
      () => axios.get(API_URL + id, { headers: authHeader() })
    );
  }

  createShipment(shipment) {
    return guestOr(
      () => guestDataApi.createShipment(shipment),
      () => axios.post(API_URL, shipment, { headers: authHeader() })
    );
  }

  updateShipment(id, shipment) {
    return guestOr(
      () => guestDataApi.updateShipment(id, shipment),
      () => axios.put(API_URL + id, shipment, { headers: authHeader() })
    );
  }

  deleteShipment(id) {
    return guestOr(
      () => guestDataApi.deleteShipment(id),
      () => axios.delete(API_URL + id, { headers: authHeader() })
    );
  }

  updateShipmentStatus(id, status) {
    return guestOr(
      () => guestDataApi.updateShipmentStatus(id, status),
      () =>
        axios.put(API_URL + 'status/' + id, null, {
          params: { status: status },
          headers: authHeader()
        })
    );
  }

  getShipmentsBySource(sourceId) {
    return guestOr(
      () =>
        guestDataApi
          .getShipments()
          .filter((shipment) => shipment.sourceId === Number(sourceId)),
      () => axios.get(API_URL + 'source/' + sourceId, { headers: authHeader() })
    );
  }

  getShipmentsByDestination(destinationId) {
    return guestOr(
      () =>
        guestDataApi
          .getShipments()
          .filter((shipment) => shipment.destinationId === Number(destinationId)),
      () => axios.get(API_URL + 'destination/' + destinationId, { headers: authHeader() })
    );
  }

  getShipmentsByStatus(status) {
    return guestOr(
      () => guestDataApi.getShipments().filter((shipment) => shipment.status === status),
      () => axios.get(API_URL + 'status/' + status, { headers: authHeader() })
    );
  }

  getShipmentsByDateRange(startDate, endDate, dateType = 'departure') {
    return guestOr(
      () => {
        const start = startDate?.getTime?.() ?? 0;
        const end = endDate?.getTime?.() ?? Number.POSITIVE_INFINITY;
        const field = dateType === 'arrival' ? 'estimatedArrival' : 'departureDate';
        return guestDataApi.getShipments().filter((shipment) => {
          const value = shipment[field] ? new Date(shipment[field]).getTime() : null;
          return value !== null && value >= start && value <= end;
        });
      },
      () =>
        axios.get(API_URL + 'date-range', {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            dateType: dateType
          },
          headers: authHeader()
        })
    );
  }
}

const shipmentService = new ShipmentService();
export default shipmentService;
