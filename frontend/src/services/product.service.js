import axios from 'axios';
import authHeader from './auth-header';
import { guestOr } from './guest-utils';
import { guestDataApi } from '../data/guestData';

const API_URL = (import.meta.env.VITE_API_URL || '') + '/api/products/';

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

const mapOne = (res) => ({
  ...res,
  data: res.data ? fromApiProduct(res.data) : res.data
});

const mapMany = (res) => ({
  ...res,
  data: Array.isArray(res.data) ? res.data.map(fromApiProduct) : res.data
});

class ProductService {
  getAllProducts() {
    return guestOr(
      () => guestDataApi.getProducts(),
      () => axios.get(API_URL, { headers: authHeader() }).then(mapMany)
    );
  }

  getProductById(id) {
    return guestOr(
      () => guestDataApi.getProductById(id),
      () => axios.get(API_URL + id, { headers: authHeader() }).then(mapOne)
    );
  }

  createProduct(product) {
    return guestOr(
      () => guestDataApi.createProduct(product),
      () => axios.post(API_URL, toApiProduct(product), { headers: authHeader() }).then(mapOne)
    );
  }

  updateProduct(id, product) {
    return guestOr(
      () => guestDataApi.updateProduct(id, product),
      () => axios.put(API_URL + id, toApiProduct(product), { headers: authHeader() }).then(mapOne)
    );
  }

  deleteProduct(id) {
    return guestOr(
      () => guestDataApi.deleteProduct(id),
      () => axios.delete(API_URL + id, { headers: authHeader() })
    );
  }

  getProductsByStatus(status) {
    return guestOr(
      () => guestDataApi.getProducts().filter((product) => product.status === status),
      () => axios.get(API_URL + 'status/' + status, { headers: authHeader() }).then(mapMany)
    );
  }

  getProductBySku(sku) {
    return guestOr(
      () => guestDataApi.getProducts().find((product) => product.sku === sku) || null,
      () => axios.get(API_URL + 'sku/' + sku, { headers: authHeader() }).then(mapOne)
    );
  }
}

const productService = new ProductService();
export default productService;
