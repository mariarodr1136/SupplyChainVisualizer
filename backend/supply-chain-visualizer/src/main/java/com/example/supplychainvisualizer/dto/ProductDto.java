package com.example.supplychainvisualizer.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class ProductDto {
    private Long id;
    
    @NotBlank
    private String name;
    
    private String description;
    
    @NotNull
    private Double unitPrice;
    
    private Double weight;
    
    private String sku;
    
    private String status = "active";
}