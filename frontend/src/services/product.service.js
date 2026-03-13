import axios from 'axios';
import authHeader from './auth-header';

const API_URL = (process.env.REACT_APP_API_URL || '') + '/api/products/';

const fromApiProduct = (product) => ({
  ...product,
  category: product.category ?? product.description ?? '',
  price: product.price ?? product.unitPrice ?? '',
});

const toApiProduct = (product) => ({
  id: product.id,
  name: product.name,
  sku: product.sku,
  description: product.description ?? product.category ?? '',
  unitPrice:
    product.unitPrice ??
    (product.price === '' || product.price === undefined ? 0 : product.price),
  weight: product.weight === '' ? null : product.weight,
  status: product.status ?? 'active',
});

class ProductService {
  getAllProducts() {
    return axios.get(API_URL, { headers: authHeader() }).then((res) => ({
      ...res,
      data: Array.isArray(res.data) ? res.data.map(fromApiProduct) : res.data
    }));
  }

  getProductById(id) {
    return axios.get(API_URL + id, { headers: authHeader() }).then((res) => ({
      ...res,
      data: res.data ? fromApiProduct(res.data) : res.data
    }));
  }

  createProduct(product) {
    return axios.post(API_URL, toApiProduct(product), { headers: authHeader() }).then((res) => ({
      ...res,
      data: res.data ? fromApiProduct(res.data) : res.data
    }));
  }

  updateProduct(id, product) {
    return axios.put(API_URL + id, toApiProduct(product), { headers: authHeader() }).then((res) => ({
      ...res,
      data: res.data ? fromApiProduct(res.data) : res.data
    }));
  }

  deleteProduct(id) {
    return axios.delete(API_URL + id, { headers: authHeader() });
  }

  getProductsByStatus(status) {
    return axios.get(API_URL + 'status/' + status, { headers: authHeader() }).then((res) => ({
      ...res,
      data: Array.isArray(res.data) ? res.data.map(fromApiProduct) : res.data
    }));
  }

  getProductBySku(sku) {
    return axios.get(API_URL + 'sku/' + sku, { headers: authHeader() }).then((res) => ({
      ...res,
      data: res.data ? fromApiProduct(res.data) : res.data
    }));
  }
}

const productService = new ProductService();
export default productService;
