import axios from 'axios';
import authHeader from './auth-header';

const API_URL = '/api/products/';

class ProductService {
  getAllProducts() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getProductById(id) {
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  createProduct(product) {
    return axios.post(API_URL, product, { headers: authHeader() });
  }

  updateProduct(id, product) {
    return axios.put(API_URL + id, product, { headers: authHeader() });
  }

  deleteProduct(id) {
    return axios.delete(API_URL + id, { headers: authHeader() });
  }

  getProductsByStatus(status) {
    return axios.get(API_URL + 'status/' + status, { headers: authHeader() });
  }

  getProductBySku(sku) {
    return axios.get(API_URL + 'sku/' + sku, { headers: authHeader() });
  }
}

const productService = new ProductService();
export default productService;
