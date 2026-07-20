import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || '') + '/api/auth/';

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + 'login', {
        username,
        password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  loginAsGuest() {
    const guestUser = {
      id: 'guest',
      username: 'Guest',
      isGuest: true
    };
    localStorage.setItem('user', JSON.stringify(guestUser));
    return Promise.resolve(guestUser);
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  register(username, password) {
    return axios.post(API_URL + 'register', {
      username,
      password
    });
  }

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  }
}

const authService = new AuthService();
export default authService;
