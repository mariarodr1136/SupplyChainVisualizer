import axios from 'axios';
import authHeader from './auth-header';
import { guestOr } from './guest-utils';
import { guestDataApi } from '../data/guestData';

const API_URL = (import.meta.env.VITE_API_URL || '') + '/api/connections/';

class ConnectionService {
  getAllConnections() {
    return guestOr(
      () => guestDataApi.getConnections(),
      () => axios.get(API_URL, { headers: authHeader() })
    );
  }

  getConnectionById(id) {
    return guestOr(
      () => guestDataApi.getConnectionById(id),
      () => axios.get(API_URL + id, { headers: authHeader() })
    );
  }

  createConnection(connection) {
    return guestOr(
      () => guestDataApi.createConnection(connection),
      () => axios.post(API_URL, connection, { headers: authHeader() })
    );
  }

  updateConnection(id, connection) {
    return guestOr(
      () => guestDataApi.updateConnection(id, connection),
      () => axios.put(API_URL + id, connection, { headers: authHeader() })
    );
  }

  deleteConnection(id) {
    return guestOr(
      () => guestDataApi.deleteConnection(id),
      () => axios.delete(API_URL + id, { headers: authHeader() })
    );
  }

  getConnectionsBySource(sourceId) {
    return guestOr(
      () =>
        guestDataApi
          .getConnections()
          .filter((connection) => connection.sourceId === Number(sourceId)),
      () => axios.get(API_URL + 'source/' + sourceId, { headers: authHeader() })
    );
  }

  getConnectionsByTarget(targetId) {
    return guestOr(
      () =>
        guestDataApi
          .getConnections()
          .filter((connection) => connection.targetId === Number(targetId)),
      () => axios.get(API_URL + 'target/' + targetId, { headers: authHeader() })
    );
  }

  getConnectionsBySourceAndTarget(sourceId, targetId) {
    return guestOr(
      () =>
        guestDataApi
          .getConnections()
          .filter(
            (connection) =>
              connection.sourceId === Number(sourceId) &&
              connection.targetId === Number(targetId)
          ),
      () =>
        axios.get(API_URL + 'nodes', {
          params: {
            sourceId: sourceId,
            targetId: targetId
          },
          headers: authHeader()
        })
    );
  }
}

const connectionService = new ConnectionService();
export default connectionService;
