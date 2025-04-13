package com.example.supplychainvisualizer.service;

import com.example.supplychainvisualizer.dto.ProductDto;

import java.util.List;
import java.util.Optional;

public interface ProductService {
    List<ProductDto> getAllProducts();
    Optional<ProductDto> getProductById(Long id);
    ProductDto createProduct(ProductDto productDto);
    Optional<ProductDto> updateProduct(Long id, ProductDto productDto);
    boolean deleteProduct(Long id);
    List<ProductDto> getProductsByStatus(String status);
    Optional<ProductDto> getProductBySku(String sku);
}