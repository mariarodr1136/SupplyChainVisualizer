import axios from 'axios';
import authHeader from './auth-header';
import { isGuestUser } from './guest-utils';
import { guestDataApi } from '../data/guestData';

const API_URL = (process.env.REACT_APP_API_URL || '') + '/api/connections/';

class ConnectionService {
  getAllConnections() {
    if (isGuestUser()) {
      return Promise.resolve({ data: guestDataApi.getConnections() });
    }
    return axios.get(API_URL, { headers: authHeader() });
  }

  getConnectionById(id) {
    if (isGuestUser()) {
      return Promise.resolve({ data: guestDataApi.getConnectionById(id) });
    }
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  createConnection(connection) {
    if (isGuestUser()) {
      return Promise.resolve({ data: guestDataApi.createConnection(connection) });
    }
    return axios.post(API_URL, connection, { headers: authHeader() });
  }

  updateConnection(id, connection) {
    if (isGuestUser()) {
      return Promise.resolve({ data: guestDataApi.updateConnection(id, connection) });
    }
    return axios.put(API_URL + id, connection, { headers: authHeader() });
  }

  deleteConnection(id) {
    if (isGuestUser()) {
      return Promise.resolve({ data: guestDataApi.deleteConnection(id) });
    }
    return axios.delete(API_URL + id, { headers: authHeader() });
  }

  getConnectionsBySource(sourceId) {
    if (isGuestUser()) {
      return Promise.resolve({
        data: guestDataApi
          .getConnections()
          .filter((connection) => connection.sourceId === Number(sourceId))
      });
    }
    return axios.get(API_URL + 'source/' + sourceId, { headers: authHeader() });
  }

  getConnectionsByTarget(targetId) {
    if (isGuestUser()) {
      return Promise.resolve({
        data: guestDataApi
          .getConnections()
          .filter((connection) => connection.targetId === Number(targetId))
      });
    }
    return axios.get(API_URL + 'target/' + targetId, { headers: authHeader() });
  }

  getConnectionsBySourceAndTarget(sourceId, targetId) {
    if (isGuestUser()) {
      return Promise.resolve({
        data: guestDataApi
          .getConnections()
          .filter(
            (connection) =>
              connection.sourceId === Number(sourceId) &&
              connection.targetId === Number(targetId)
          )
      });
    }
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
