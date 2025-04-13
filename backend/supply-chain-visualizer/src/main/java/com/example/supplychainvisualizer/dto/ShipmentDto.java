package com.example.supplychainvisualizer.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ShipmentDto {
    private Long id;
    
    @NotNull
    private Long sourceId;
    
    @NotNull
    private Long destinationId;
    
    private String status = "pending";
    
    private LocalDateTime departureDate;
    
    private LocalDateTime estimatedArrival;
    
    private LocalDateTime actualArrival;
    
    private List<ShipmentItemDto> items;
}