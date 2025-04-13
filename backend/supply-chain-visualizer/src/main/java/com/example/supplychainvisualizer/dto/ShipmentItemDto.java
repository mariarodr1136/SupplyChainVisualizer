package com.example.supplychainvisualizer.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class ShipmentItemDto {
    private Long id;
    
    @NotNull
    private Long productId;
    
    @NotNull
    private Integer quantity;
}