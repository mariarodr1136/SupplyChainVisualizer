import axios from 'axios';
import authHeader from './auth-header';

const API_URL = (process.env.REACT_APP_API_URL || '') + '/api/nodes/';

class NodeService {
  getAllNodes() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getNodeById(id) {
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  createNode(node) {
    return axios.post(API_URL, node, { headers: authHeader() });
  }

  updateNode(id, node) {
    return axios.put(API_URL + id, node, { headers: authHeader() });
  }

  deleteNode(id) {
    return axios.delete(API_URL + id, { headers: authHeader() });
  }

  getNodesByType(type) {
    return axios.get(API_URL + 'type/' + type, { headers: authHeader() });
  }

  getNodesByStatus(status) {
    return axios.get(API_URL + 'status/' + status, { headers: authHeader() });
  }
}

const nodeService = new NodeService();
export default nodeService;
