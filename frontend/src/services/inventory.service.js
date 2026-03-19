import axios from 'axios';
import authHeader from './auth-header';
import { isGuestUser } from './guest-utils';
import { guestDataApi } from '../data/guestData';

const API_URL = (process.env.REACT_APP_API_URL || '') + '/api/inventory/';

class InventoryService {
  getAllInventory() {
    if (isGuestUser()) {
      return Promise.resolve({ data: guestDataApi.getInventory() });
    }
    return axios.get(API_URL, { headers: authHeader() });
  }

  getInventoryById(id) {
    if (isGuestUser()) {
      const item = guestDataApi.getInventory().find((entry) => entry.id === Number(id)) || null;
      return Promise.resolve({ data: item });
    }
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  createOrUpdateInventory(inventory) {
    if (isGuestUser()) {
      return Promise.resolve({ data: guestDataApi.createOrUpdateInventory(inventory) });
    }
    return axios.post(API_URL, inventory, { headers: authHeader() });
  }

  updateInventory(id, inventory) {
    if (isGuestUser()) {
      return Promise.resolve({ data: guestDataApi.updateInventory(id, inventory) });
    }
    return axios.put(API_URL + id, inventory, { headers: authHeader() });
  }

  deleteInventory(id) {
    if (isGuestUser()) {
      return Promise.resolve({ data: guestDataApi.deleteInventory(id) });
    }
    return axios.delete(API_URL + id, { headers: authHeader() });
  }

  getInventoryByNode(nodeId) {
    if (isGuestUser()) {
      return Promise.resolve({ data: guestDataApi.getInventoryByNode(nodeId) });
    }
    return axios.get(API_URL + 'node/' + nodeId, { headers: authHeader() });
  }

  getInventoryByProduct(productId) {
    if (isGuestUser()) {
      return Promise.resolve({ data: guestDataApi.getInventoryByProduct(productId) });
    }
    return axios.get(API_URL + 'product/' + productId, { headers: authHeader() });
  }

  getLowStockInventory() {
    if (isGuestUser()) {
      return Promise.resolve({ data: guestDataApi.getLowStockInventory() });
    }
    return axios.get(API_URL + 'low-stock', { headers: authHeader() });
  }
}

const inventoryService = new InventoryService();
export default inventoryService;
