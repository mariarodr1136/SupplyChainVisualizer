import axios from 'axios';
import authHeader from './auth-header';

const API_URL = '/api/connections/';

class ConnectionService {
  getAllConnections() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getConnectionById(id) {
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  createConnection(connection) {
    return axios.post(API_URL, connection, { headers: authHeader() });
  }

  updateConnection(id, connection) {
    return axios.put(API_URL + id, connection, { headers: authHeader() });
  }

  deleteConnection(id) {
    return axios.delete(API_URL + id, { headers: authHeader() });
  }

  getConnectionsBySource(sourceId) {
    return axios.get(API_URL + 'source/' + sourceId, { headers: authHeader() });
  }

  getConnectionsByTarget(targetId) {
    return axios.get(API_URL + 'target/' + targetId, { headers: authHeader() });
  }

  getConnectionsBySourceAndTarget(sourceId, targetId) {
    return axios.get(API_URL + 'nodes', {
      params: {
        sourceId: sourceId,
        targetId: targetId
      },
      headers: authHeader()
    });
  }
}

const connectionService = new ConnectionService();
export default connectionService;
