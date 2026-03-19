import axios from 'axios';
import authHeader from './auth-header';
import { isGuestUser } from './guest-utils';
import { guestDataApi } from '../data/guestData';

const API_URL = (process.env.REACT_APP_API_URL || '') + '/api/nodes/';

class NodeService {
  getAllNodes() {
    if (isGuestUser()) {
      return Promise.resolve({ data: guestDataApi.getNodes() });
    }
    return axios.get(API_URL, { headers: authHeader() });
  }

  getNodeById(id) {
    if (isGuestUser()) {
      return Promise.resolve({ data: guestDataApi.getNodeById(id) });
    }
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  createNode(node) {
    if (isGuestUser()) {
      return Promise.resolve({ data: guestDataApi.createNode(node) });
    }
    return axios.post(API_URL, node, { headers: authHeader() });
  }

  updateNode(id, node) {
    if (isGuestUser()) {
      return Promise.resolve({ data: guestDataApi.updateNode(id, node) });
    }
    return axios.put(API_URL + id, node, { headers: authHeader() });
  }

  deleteNode(id) {
    if (isGuestUser()) {
      return Promise.resolve({ data: guestDataApi.deleteNode(id) });
    }
    return axios.delete(API_URL + id, { headers: authHeader() });
  }

  getNodesByType(type) {
    if (isGuestUser()) {
      return Promise.resolve({
        data: guestDataApi.getNodes().filter((node) => node.type === type)
      });
    }
    return axios.get(API_URL + 'type/' + type, { headers: authHeader() });
  }

  getNodesByStatus(status) {
    if (isGuestUser()) {
      return Promise.resolve({
        data: guestDataApi.getNodes().filter((node) => node.status === status)
      });
    }
    return axios.get(API_URL + 'status/' + status, { headers: authHeader() });
  }
}

const nodeService = new NodeService();
export default nodeService;
