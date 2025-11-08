import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class UserService {
  getUserDetails() {
    return axios.get(`${API_URL}/users/profile`, { headers: authHeader() });
  }
  
  updateUserProfile(userData) {
    return axios.put(`${API_URL}/users/profile`, userData, { headers: authHeader() });
  }
  
  changePassword(passwordData) {
    return axios.post(`${API_URL}/users/change-password`, passwordData, { headers: authHeader() });
  }
  
  // Admin functions
  getAllUsers() {
    return axios.get(`${API_URL}/admin/users`, { headers: authHeader() });
  }
  
  getUserById(id) {
    return axios.get(`${API_URL}/admin/users/${id}`, { headers: authHeader() });
  }
  
  createUser(userData) {
    return axios.post(`${API_URL}/admin/users`, userData, { headers: authHeader() });
  }
  
  updateUser(id, userData) {
    return axios.put(`${API_URL}/admin/users/${id}`, userData, { headers: authHeader() });
  }
  
  deleteUser(id) {
    return axios.delete(`${API_URL}/admin/users/${id}`, { headers: authHeader() });
  }
}

const userService = new UserService();
export default userService;
