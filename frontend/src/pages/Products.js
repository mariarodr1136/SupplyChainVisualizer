import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { FaPlus, FaSearch, FaEdit, FaTrashAlt, FaSyncAlt, FaBoxOpen } from 'react-icons/fa';
import ProductService from '../services/product.service';
import PageHeader from '../components/common/PageHeader';
import ProductModal from '../components/product/ProductModal';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category).filter(Boolean))];
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProductsData();
  }, []);

  const loadProductsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ProductService.getAllProducts();
      setProducts(response.data);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load products data');
      setLoading(false);
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleModalSave = async (productData) => {
    try {
      if (productData.id) {
        // Update existing product
        await ProductService.updateProduct(productData.id, productData);
      } else {
        // Create new product
        await ProductService.createProduct(productData);
      }
      
      // Reload products data
      loadProductsData();
      
      // Close modal
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Failed to save product. Please try again.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    
    try {
      await ProductService.deleteProduct(selectedProduct.id);
      
      // Remove from local state
      setProducts(products.filter(product => product.id !== selectedProduct.id));
      
      // Close modal
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete product. Please try again.');
    }
  };

  // Apply filters and search
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = filterCategory === '' || product.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Show loading spinner
  if (loading && products.length === 0) {
    return (
      <Container>
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading products data...</p>
        </div>
      </Container>
    );
  }

  // Show error message
  if (error) {
    return (
      <Container>
        <div className="my-5">
          <Alert variant="danger">
            <Alert.Heading>Error Loading Products</Alert.Heading>
            <p>{error}</p>
            <Button variant="outline-danger" onClick={loadProductsData}>Try Again</Button>
          </Alert>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <PageHeader title="Products">
        <div className="stats-summary">
          <div className="stat-item">
            <div className="stat-value">{products.length}</div>
            <div className="stat-label">Total Products</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{categories.length}</div>
            <div className="stat-label">Categories</div>
          </div>
        </div>
      </PageHeader>
      
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <Form.Group className="me-3">
                    <div className="position-relative">
                      <Form.Control
                        type="text"
                        placeholder="Search by name or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <FaSearch className="search-icon" />
                    </div>
                  </Form.Group>
                  
                  <Form.Group>
                    <Form.Select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      aria-label="Filter by Category"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
                
                <div>
                  <Button variant="outline-secondary" className="me-2" onClick={loadProductsData}>
                    <FaSyncAlt /> Refresh
                  </Button>
                  <Button variant="primary" onClick={handleAddNew}>
                    <FaPlus /> Add Product
                  </Button>
                </div>
              </div>
              
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Weight (kg)</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <tr key={product.id}>
                        <td>{product.sku}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="product-icon">
                              <FaBoxOpen />
                            </div>
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td>{product.category || '-'}</td>
                        <td>{product.weight || '-'}</td>
                        <td>
                          {product.price ? `$${product.price.toFixed(2)}` : '-'}
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            className="me-1"
                            onClick={() => handleEdit(product)}
                            title="Edit"
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDelete(product)}
                            title="Delete"
                          >
                            <FaTrashAlt />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No products found. Adjust your filters or add a new product.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Product Modal */}
      <ProductModal
        show={showModal}
        onHide={() => setShowModal(false)}
        product={selectedProduct}
        onSave={handleModalSave}
        isNew={!selectedProduct}
      />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete the product "${selectedProduct?.name}"? This will also remove all inventory records associated with this product. This action cannot be undone.`}
      />
    </Container>
  );
};

export default Products;