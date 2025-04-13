package com.example.supplychainvisualizer.service.impl;

import com.example.supplychainvisualizer.dto.ProductDto;
import com.example.supplychainvisualizer.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    @Override
    public List<ProductDto> getAllProducts() {
        return new ArrayList<>();
    }

    @Override
    public Optional<ProductDto> getProductById(Long id) {
        return Optional.empty();
    }

    @Override
    public ProductDto createProduct(ProductDto productDto) {
        return productDto;
    }

    @Override
    public Optional<ProductDto> updateProduct(Long id, ProductDto productDto) {
        return Optional.empty();
    }

    @Override
    public boolean deleteProduct(Long id) {
        return false;
    }

    @Override
    public List<ProductDto> getProductsByStatus(String status) {
        return new ArrayList<>();
    }

    @Override
    public Optional<ProductDto> getProductBySku(String sku) {
        return Optional.empty();
    }
}