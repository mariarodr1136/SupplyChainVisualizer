package com.example.supplychainvisualizer.service.impl;

import com.example.supplychainvisualizer.dto.ProductDto;
import com.example.supplychainvisualizer.model.Product;
import com.example.supplychainvisualizer.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(1L);
        product.setName("Laptop Model X");
        product.setDescription("High performance laptop");
        product.setUnitPrice(999.99);
        product.setWeight(2.5);
        product.setSku("LT-X-001");
        product.setStatus("active");
    }

    @Test
    void getAllProducts_returnsMappedDtos() {
        when(productRepository.findAll()).thenReturn(List.of(product));

        List<ProductDto> result = productService.getAllProducts();

        assertThat(result).hasSize(1);
        ProductDto dto = result.get(0);
        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getName()).isEqualTo("Laptop Model X");
        assertThat(dto.getSku()).isEqualTo("LT-X-001");
        assertThat(dto.getUnitPrice()).isEqualTo(999.99);
    }

    @Test
    void getAllProducts_empty_returnsEmptyList() {
        when(productRepository.findAll()).thenReturn(List.of());

        List<ProductDto> result = productService.getAllProducts();

        assertThat(result).isEmpty();
    }

    @Test
    void getProductById_found_returnsDto() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        Optional<ProductDto> result = productService.getProductById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(1L);
        assertThat(result.get().getName()).isEqualTo("Laptop Model X");
    }

    @Test
    void getProductById_notFound_returnsEmpty() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<ProductDto> result = productService.getProductById(999L);

        assertThat(result).isEmpty();
    }

    @Test
    void createProduct_savesAndReturnsDto() {
        ProductDto dto = new ProductDto();
        dto.setName("Widget Pro");
        dto.setUnitPrice(49.99);
        dto.setSku("WGT-PRO-01");
        dto.setStatus("active");

        Product saved = new Product();
        saved.setId(2L);
        saved.setName("Widget Pro");
        saved.setUnitPrice(49.99);
        saved.setSku("WGT-PRO-01");
        saved.setStatus("active");

        when(productRepository.save(any())).thenReturn(saved);

        ProductDto result = productService.createProduct(dto);

        assertThat(result.getId()).isEqualTo(2L);
        assertThat(result.getName()).isEqualTo("Widget Pro");
        assertThat(result.getSku()).isEqualTo("WGT-PRO-01");
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void updateProduct_found_updatesAndReturnsDto() {
        ProductDto dto = new ProductDto();
        dto.setName("Laptop Model X v2");
        dto.setUnitPrice(1099.99);
        dto.setSku("LT-X-002");
        dto.setStatus("active");

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any())).thenReturn(product);

        Optional<ProductDto> result = productService.updateProduct(1L, dto);

        assertThat(result).isPresent();
        verify(productRepository).save(product);
    }

    @Test
    void updateProduct_notFound_returnsEmpty() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<ProductDto> result = productService.updateProduct(999L, new ProductDto());

        assertThat(result).isEmpty();
        verify(productRepository, never()).save(any());
    }

    @Test
    void deleteProduct_found_returnsTrue() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        boolean result = productService.deleteProduct(1L);

        assertThat(result).isTrue();
        verify(productRepository).delete(product);
    }

    @Test
    void deleteProduct_notFound_returnsFalse() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        boolean result = productService.deleteProduct(999L);

        assertThat(result).isFalse();
        verify(productRepository, never()).delete(any());
    }

    @Test
    void getProductsByStatus_returnsFilteredList() {
        when(productRepository.findByStatus("active")).thenReturn(List.of(product));

        List<ProductDto> result = productService.getProductsByStatus("active");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo("active");
    }

    @Test
    void getProductBySku_found_returnsDto() {
        when(productRepository.findBySku("LT-X-001")).thenReturn(Optional.of(product));

        Optional<ProductDto> result = productService.getProductBySku("LT-X-001");

        assertThat(result).isPresent();
        assertThat(result.get().getSku()).isEqualTo("LT-X-001");
    }

    @Test
    void getProductBySku_notFound_returnsEmpty() {
        when(productRepository.findBySku("UNKNOWN")).thenReturn(Optional.empty());

        Optional<ProductDto> result = productService.getProductBySku("UNKNOWN");

        assertThat(result).isEmpty();
    }
}
