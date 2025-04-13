package com.example.supplychainvisualizer.service.impl;

import com.example.supplychainvisualizer.dto.InventoryDto;
import com.example.supplychainvisualizer.service.InventoryService;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class InventoryServiceImpl implements InventoryService {

    @Override
    public List<InventoryDto> getAllInventory() {
        return new ArrayList<>();
    }

    @Override
    public Optional<InventoryDto> getInventoryById(Long id) {
        return Optional.empty();
    }

    @Override
    public InventoryDto createOrUpdateInventory(InventoryDto inventoryDto) {
        return inventoryDto;
    }

    @Override
    public boolean deleteInventory(Long id) {
        return false;
    }

    @Override
    public List<InventoryDto> getInventoryByNode(Long nodeId) {
        return new ArrayList<>();
    }

    @Override
    public List<InventoryDto> getInventoryByProduct(Long productId) {
        return new ArrayList<>();
    }

    @Override
    public List<InventoryDto> getLowStockInventory() {
        return new ArrayList<>();
    }
}