package com.example.supplychainvisualizer.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class ConnectionDto {
    private Long id;
    
    @NotNull
    private Long sourceId;
    
    @NotNull
    private Long targetId;
    
    private String transportationType;
    
    private Double distance;
    
    private Integer travelTime;
    
    private Double costPerUnit;
    
    private String status = "active";
}