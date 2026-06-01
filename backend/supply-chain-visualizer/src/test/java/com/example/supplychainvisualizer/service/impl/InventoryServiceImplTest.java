package com.example.supplychainvisualizer.service.impl;

import com.example.supplychainvisualizer.dto.InventoryDto;
import com.example.supplychainvisualizer.model.Inventory;
import com.example.supplychainvisualizer.model.Node;
import com.example.supplychainvisualizer.model.Product;
import com.example.supplychainvisualizer.repository.InventoryRepository;
import com.example.supplychainvisualizer.repository.NodeRepository;
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
class InventoryServiceImplTest {

    @Mock private InventoryRepository inventoryRepository;
    @Mock private NodeRepository nodeRepository;
    @Mock private ProductRepository productRepository;

    @InjectMocks
    private InventoryServiceImpl inventoryService;

    private Node node;
    private Product product;
    private Inventory inventory;

    @BeforeEach
    void setUp() {
        node = new Node();
        node.setId(1L);
        node.setName("Central Warehouse");
        node.setType("warehouse");

        product = new Product();
        product.setId(2L);
        product.setName("Widget");

        inventory = new Inventory();
        inventory.setId(100L);
        inventory.setNode(node);
        inventory.setProduct(product);
        inventory.setQuantity(50);
        inventory.setMinThreshold(100);
        inventory.setMaxThreshold(500);
    }

    @Test
    void getAllInventory_returnsMappedDtos() {
        when(inventoryRepository.findAll()).thenReturn(List.of(inventory));

        List<InventoryDto> result = inventoryService.getAllInventory();

        assertThat(result).hasSize(1);
        InventoryDto dto = result.get(0);
        assertThat(dto.getId()).isEqualTo(100L);
        assertThat(dto.getNodeName()).isEqualTo("Central Warehouse");
        assertThat(dto.getProductName()).isEqualTo("Widget");
        assertThat(dto.getQuantity()).isEqualTo(50);
    }

    @Test
    void getInventoryById_found_returnsDto() {
        when(inventoryRepository.findById(100L)).thenReturn(Optional.of(inventory));

        Optional<InventoryDto> result = inventoryService.getInventoryById(100L);

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(100L);
    }

    @Test
    void getInventoryById_notFound_returnsEmpty() {
        when(inventoryRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<InventoryDto> result = inventoryService.getInventoryById(999L);

        assertThat(result).isEmpty();
    }

    @Test
    void getLowStockInventory_returnsItemsBelowThreshold() {
        when(inventoryRepository.findLowStock()).thenReturn(List.of(inventory));

        List<InventoryDto> result = inventoryService.getLowStockInventory();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isIn("low", "critical");
    }

    @Test
    void computeStatus_belowMin_returnsLow() {
        inventory.setQuantity(80);
        inventory.setMinThreshold(100);
        when(inventoryRepository.findAll()).thenReturn(List.of(inventory));

        List<InventoryDto> result = inventoryService.getAllInventory();

        assertThat(result.get(0).getStatus()).isEqualTo("low");
    }

    @Test
    void computeStatus_atOrBelowZero_returnsCritical() {
        inventory.setQuantity(0);
        when(inventoryRepository.findAll()).thenReturn(List.of(inventory));

        List<InventoryDto> result = inventoryService.getAllInventory();

        assertThat(result.get(0).getStatus()).isEqualTo("critical");
    }

    @Test
    void computeStatus_aboveMax_returnsExcess() {
        inventory.setQuantity(600);
        inventory.setMaxThreshold(500);
        when(inventoryRepository.findAll()).thenReturn(List.of(inventory));

        List<InventoryDto> result = inventoryService.getAllInventory();

        assertThat(result.get(0).getStatus()).isEqualTo("excess");
    }

    @Test
    void computeStatus_withinBounds_returnsOptimal() {
        inventory.setQuantity(200);
        when(inventoryRepository.findAll()).thenReturn(List.of(inventory));

        List<InventoryDto> result = inventoryService.getAllInventory();

        assertThat(result.get(0).getStatus()).isEqualTo("optimal");
    }

    @Test
    void createOrUpdateInventory_existingRecord_updatesQuantity() {
        InventoryDto dto = new InventoryDto();
        dto.setNodeId(1L);
        dto.setProductId(2L);
        dto.setQuantity(300);
        dto.setMinThreshold(100);
        dto.setMaxThreshold(500);

        when(nodeRepository.findById(1L)).thenReturn(Optional.of(node));
        when(productRepository.findById(2L)).thenReturn(Optional.of(product));
        when(inventoryRepository.findByNodeAndProduct(node, product)).thenReturn(Optional.of(inventory));
        when(inventoryRepository.save(any())).thenReturn(inventory);

        inventoryService.createOrUpdateInventory(dto);

        verify(inventoryRepository).save(argThat(inv -> inv.getQuantity() == 300));
    }

    @Test
    void deleteInventory_found_returnsTrue() {
        when(inventoryRepository.findById(100L)).thenReturn(Optional.of(inventory));

        boolean result = inventoryService.deleteInventory(100L);

        assertThat(result).isTrue();
        verify(inventoryRepository).delete(inventory);
    }

    @Test
    void deleteInventory_notFound_returnsFalse() {
        when(inventoryRepository.findById(999L)).thenReturn(Optional.empty());

        boolean result = inventoryService.deleteInventory(999L);

        assertThat(result).isFalse();
    }
}
