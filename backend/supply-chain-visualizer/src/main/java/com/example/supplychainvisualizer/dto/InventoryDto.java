package com.example.supplychainvisualizer.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class InventoryDto {
    private Long id;
    
    @NotNull
    private Long nodeId;
    
    @NotNull
    private Long productId;
    
    @NotNull
    private Integer quantity;
    
    private Integer minThreshold;
    
    private Integer maxThreshold;
}