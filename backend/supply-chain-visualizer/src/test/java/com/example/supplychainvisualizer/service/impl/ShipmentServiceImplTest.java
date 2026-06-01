package com.example.supplychainvisualizer.service.impl;

import com.example.supplychainvisualizer.dto.ShipmentDto;
import com.example.supplychainvisualizer.model.Inventory;
import com.example.supplychainvisualizer.model.Node;
import com.example.supplychainvisualizer.model.Product;
import com.example.supplychainvisualizer.model.Shipment;
import com.example.supplychainvisualizer.model.ShipmentItem;
import com.example.supplychainvisualizer.repository.InventoryRepository;
import com.example.supplychainvisualizer.repository.NodeRepository;
import com.example.supplychainvisualizer.repository.ProductRepository;
import com.example.supplychainvisualizer.repository.ShipmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShipmentServiceImplTest {

    @Mock private ShipmentRepository shipmentRepository;
    @Mock private NodeRepository nodeRepository;
    @Mock private ProductRepository productRepository;
    @Mock private InventoryRepository inventoryRepository;

    @InjectMocks
    private ShipmentServiceImpl shipmentService;

    private Node source;
    private Node destination;
    private Shipment shipment;

    @BeforeEach
    void setUp() {
        source = new Node();
        source.setId(1L);
        source.setName("Factory A");
        source.setType("factory");

        destination = new Node();
        destination.setId(2L);
        destination.setName("Warehouse B");
        destination.setType("warehouse");

        shipment = new Shipment();
        shipment.setId(10L);
        shipment.setSource(source);
        shipment.setDestination(destination);
        shipment.setStatus("in_transit");
        shipment.setDepartureDate(LocalDate.of(2026, 1, 1));
        shipment.setEstimatedArrival(LocalDate.of(2026, 1, 10));
        shipment.setItems(new HashSet<>());
    }

    @Test
    void getAllShipments_returnsMappedDtos() {
        when(shipmentRepository.findAll()).thenReturn(List.of(shipment));

        List<ShipmentDto> result = shipmentService.getAllShipments();

        assertThat(result).hasSize(1);
        ShipmentDto dto = result.get(0);
        assertThat(dto.getId()).isEqualTo(10L);
        assertThat(dto.getSourceId()).isEqualTo(1L);
        assertThat(dto.getSourceName()).isEqualTo("Factory A");
        assertThat(dto.getDestinationId()).isEqualTo(2L);
        assertThat(dto.getStatus()).isEqualTo("in_transit");
    }

    @Test
    void getShipmentById_found_returnsDto() {
        when(shipmentRepository.findById(10L)).thenReturn(Optional.of(shipment));

        Optional<ShipmentDto> result = shipmentService.getShipmentById(10L);

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(10L);
    }

    @Test
    void getShipmentById_notFound_returnsEmpty() {
        when(shipmentRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<ShipmentDto> result = shipmentService.getShipmentById(99L);

        assertThat(result).isEmpty();
    }

    @Test
    void updateShipmentStatus_toDelivered_adjustsInventory() {
        Product product = new Product();
        product.setId(5L);
        product.setName("Widget");

        ShipmentItem item = new ShipmentItem();
        item.setProduct(product);
        item.setQuantity(50);

        Set<ShipmentItem> items = new HashSet<>();
        items.add(item);
        shipment.setItems(items);
        shipment.setStatus("in_transit");

        Inventory existingInventory = new Inventory();
        existingInventory.setNode(destination);
        existingInventory.setProduct(product);
        existingInventory.setQuantity(100);

        when(shipmentRepository.findById(10L)).thenReturn(Optional.of(shipment));
        when(inventoryRepository.findByNodeAndProduct(destination, product))
                .thenReturn(Optional.of(existingInventory));
        when(shipmentRepository.save(any())).thenReturn(shipment);
        when(inventoryRepository.save(any())).thenReturn(existingInventory);

        shipmentService.updateShipmentStatus(10L, "delivered");

        verify(inventoryRepository).save(argThat(inv -> inv.getQuantity() == 150));
    }

    @Test
    void updateShipmentStatus_alreadyDelivered_doesNotAdjustInventoryAgain() {
        shipment.setStatus("delivered");
        shipment.setItems(new HashSet<>());

        when(shipmentRepository.findById(10L)).thenReturn(Optional.of(shipment));
        when(shipmentRepository.save(any())).thenReturn(shipment);

        shipmentService.updateShipmentStatus(10L, "delivered");

        verify(inventoryRepository, never()).save(any());
    }

    @Test
    void deleteShipment_found_returnsTrue() {
        when(shipmentRepository.findById(10L)).thenReturn(Optional.of(shipment));

        boolean result = shipmentService.deleteShipment(10L);

        assertThat(result).isTrue();
        verify(shipmentRepository).delete(shipment);
    }

    @Test
    void deleteShipment_notFound_returnsFalse() {
        when(shipmentRepository.findById(99L)).thenReturn(Optional.empty());

        boolean result = shipmentService.deleteShipment(99L);

        assertThat(result).isFalse();
        verify(shipmentRepository, never()).delete(any());
    }

    @Test
    void getShipmentsByStatus_returnsFilteredList() {
        when(shipmentRepository.findByStatus("delayed")).thenReturn(List.of(shipment));

        List<ShipmentDto> result = shipmentService.getShipmentsByStatus("delayed");

        assertThat(result).hasSize(1);
    }
}
