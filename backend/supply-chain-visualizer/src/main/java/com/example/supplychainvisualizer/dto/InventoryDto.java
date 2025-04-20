package com.example.supplychainvisualizer.dto;

import javax.validation.constraints.NotNull;

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
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getNodeId() {
        return nodeId;
    }
    
    public void setNodeId(Long nodeId) {
        this.nodeId = nodeId;
    }
    
    public Long getProductId() {
        return productId;
    }
    
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public Integer getMinThreshold() {
        return minThreshold;
    }
    
    public void setMinThreshold(Integer minThreshold) {
        this.minThreshold = minThreshold;
    }
    
    public Integer getMaxThreshold() {
        return maxThreshold;
    }
    
    public void setMaxThreshold(Integer maxThreshold) {
        this.maxThreshold = maxThreshold;
    }
}