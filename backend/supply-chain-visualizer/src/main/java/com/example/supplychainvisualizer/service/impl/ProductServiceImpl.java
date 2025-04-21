package com.example.supplychainvisualizer.service.impl;

import com.example.supplychainvisualizer.dto.ProductDto;
import com.example.supplychainvisualizer.model.Product;
import com.example.supplychainvisualizer.repository.ProductRepository;
import com.example.supplychainvisualizer.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.beans.BeanUtils;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ProductDto> getProductById(Long id) {
        return productRepository.findById(id).map(this::convertToDto);
    }

    @Override
    public ProductDto createProduct(ProductDto productDto) {
        Product product = convertToEntity(productDto);
        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    @Override
    public Optional<ProductDto> updateProduct(Long id, ProductDto productDto) {
        return productRepository.findById(id).map(existingProduct -> {
            // Don't update the ID
            productDto.setId(id);
            BeanUtils.copyProperties(productDto, existingProduct, "id", "createdAt");
            Product updatedProduct = productRepository.save(existingProduct);
            return convertToDto(updatedProduct);
        });
    }

    @Override
    public boolean deleteProduct(Long id) {
        return productRepository.findById(id).map(product -> {
            productRepository.delete(product);
            return true;
        }).orElse(false);
    }

    @Override
    public List<ProductDto> getProductsByStatus(String status) {
        return productRepository.findByStatus(status).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ProductDto> getProductBySku(String sku) {
        return productRepository.findBySku(sku).map(this::convertToDto);
    }

    private ProductDto convertToDto(Product product) {
        ProductDto productDto = new ProductDto();
        BeanUtils.copyProperties(product, productDto);
        return productDto;
    }

    private Product convertToEntity(ProductDto productDto) {
        Product product = new Product();
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setUnitPrice(productDto.getUnitPrice());
        product.setWeight(productDto.getWeight());
        product.setSku(productDto.getSku());
        product.setStatus(productDto.getStatus());
        return product;
    }
}