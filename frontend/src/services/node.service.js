import axios from 'axios';
import authHeader from './auth-header';
import { guestOr } from './guest-utils';
import { guestDataApi } from '../data/guestData';

const API_URL = (import.meta.env.VITE_API_URL || '') + '/api/nodes/';

class NodeService {
  getAllNodes() {
    return guestOr(
      () => guestDataApi.getNodes(),
      () => axios.get(API_URL, { headers: authHeader() })
    );
  }

  getNodeById(id) {
    return guestOr(
      () => guestDataApi.getNodeById(id),
      () => axios.get(API_URL + id, { headers: authHeader() })
    );
  }

  createNode(node) {
    return guestOr(
      () => guestDataApi.createNode(node),
      () => axios.post(API_URL, node, { headers: authHeader() })
    );
  }

  updateNode(id, node) {
    return guestOr(
      () => guestDataApi.updateNode(id, node),
      () => axios.put(API_URL + id, node, { headers: authHeader() })
    );
  }

  deleteNode(id) {
    return guestOr(
      () => guestDataApi.deleteNode(id),
      () => axios.delete(API_URL + id, { headers: authHeader() })
    );
  }

  getNodesByType(type) {
    return guestOr(
      () => guestDataApi.getNodes().filter((node) => node.type === type),
      () => axios.get(API_URL + 'type/' + type, { headers: authHeader() })
    );
  }

  getNodesByStatus(status) {
    return guestOr(
      () => guestDataApi.getNodes().filter((node) => node.status === status),
      () => axios.get(API_URL + 'status/' + status, { headers: authHeader() })
    );
  }
}

const nodeService = new NodeService();
export default nodeService;
