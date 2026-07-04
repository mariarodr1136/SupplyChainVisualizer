import axios from 'axios';
import authHeader from './auth-header';
import { guestOr } from './guest-utils';
import { guestDataApi } from '../data/guestData';

const API_URL = (import.meta.env.VITE_API_URL || '') + '/api/inventory/';

class InventoryService {
  getAllInventory() {
    return guestOr(
      () => guestDataApi.getInventory(),
      () => axios.get(API_URL, { headers: authHeader() })
    );
  }

  getInventoryById(id) {
    return guestOr(
      () => guestDataApi.getInventory().find((entry) => entry.id === Number(id)) || null,
      () => axios.get(API_URL + id, { headers: authHeader() })
    );
  }

  createOrUpdateInventory(inventory) {
    return guestOr(
      () => guestDataApi.createOrUpdateInventory(inventory),
      () => axios.post(API_URL, inventory, { headers: authHeader() })
    );
  }

  updateInventory(id, inventory) {
    return guestOr(
      () => guestDataApi.updateInventory(id, inventory),
      () => axios.put(API_URL + id, inventory, { headers: authHeader() })
    );
  }

  deleteInventory(id) {
    return guestOr(
      () => guestDataApi.deleteInventory(id),
      () => axios.delete(API_URL + id, { headers: authHeader() })
    );
  }

  getInventoryByNode(nodeId) {
    return guestOr(
      () => guestDataApi.getInventoryByNode(nodeId),
      () => axios.get(API_URL + 'node/' + nodeId, { headers: authHeader() })
    );
  }

  getInventoryByProduct(productId) {
    return guestOr(
      () => guestDataApi.getInventoryByProduct(productId),
      () => axios.get(API_URL + 'product/' + productId, { headers: authHeader() })
    );
  }

  getLowStockInventory() {
    return guestOr(
      () => guestDataApi.getLowStockInventory(),
      () => axios.get(API_URL + 'low-stock', { headers: authHeader() })
    );
  }
}

const inventoryService = new InventoryService();
export default inventoryService;
