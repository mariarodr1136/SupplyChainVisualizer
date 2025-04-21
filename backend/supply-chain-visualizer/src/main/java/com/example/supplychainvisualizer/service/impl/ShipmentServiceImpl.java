package com.example.supplychainvisualizer.service.impl;

import com.example.supplychainvisualizer.dto.ShipmentDto;
import com.example.supplychainvisualizer.dto.ShipmentItemDto;
import com.example.supplychainvisualizer.model.Node;
import com.example.supplychainvisualizer.model.Product;
import com.example.supplychainvisualizer.model.Shipment;
import com.example.supplychainvisualizer.model.ShipmentItem;
import com.example.supplychainvisualizer.repository.NodeRepository;
import com.example.supplychainvisualizer.repository.ProductRepository;
import com.example.supplychainvisualizer.repository.ShipmentRepository;
import com.example.supplychainvisualizer.service.ShipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ShipmentServiceImpl implements ShipmentService {

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private NodeRepository nodeRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<ShipmentDto> getAllShipments() {
        return shipmentRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ShipmentDto> getShipmentById(Long id) {
        return shipmentRepository.findById(id).map(this::convertToDto);
    }

    @Override
    public ShipmentDto createShipment(ShipmentDto shipmentDto) {
        Optional<Node> sourceOpt = nodeRepository.findById(shipmentDto.getSourceId());
        Optional<Node> destinationOpt = nodeRepository.findById(shipmentDto.getDestinationId());
        
        if (sourceOpt.isPresent() && destinationOpt.isPresent()) {
            Shipment shipment = new Shipment();
            shipment.setSource(sourceOpt.get());
            shipment.setDestination(destinationOpt.get());
            shipment.setStatus(shipmentDto.getStatus());
            shipment.setDepartureDate(shipmentDto.getDepartureDate());
            shipment.setEstimatedArrival(shipmentDto.getEstimatedArrival());
            shipment.setActualArrival(shipmentDto.getActualArrival());
            
            // Process shipment items
            if (shipmentDto.getItems() != null && !shipmentDto.getItems().isEmpty()) {
                Set<ShipmentItem> items = new HashSet<>();
                
                for (ShipmentItemDto itemDto : shipmentDto.getItems()) {
                    Optional<Product> productOpt = productRepository.findById(itemDto.getProductId());
                    if (productOpt.isPresent()) {
                        ShipmentItem item = new ShipmentItem();
                        item.setProduct(productOpt.get());
                        item.setQuantity(itemDto.getQuantity());
                        item.setShipment(shipment);
                        items.add(item);
                    }
                }
                
                shipment.setItems(items);
            }
            
            Shipment savedShipment = shipmentRepository.save(shipment);
            return convertToDto(savedShipment);
        }
        
        return shipmentDto; // Return original if nodes not found
    }

    @Override
    public Optional<ShipmentDto> updateShipment(Long id, ShipmentDto shipmentDto) {
        return shipmentRepository.findById(id).map(existingShipment -> {
            Optional<Node> sourceOpt = nodeRepository.findById(shipmentDto.getSourceId());
            Optional<Node> destinationOpt = nodeRepository.findById(shipmentDto.getDestinationId());
            
            if (sourceOpt.isPresent() && destinationOpt.isPresent()) {
                existingShipment.setSource(sourceOpt.get());
                existingShipment.setDestination(destinationOpt.get());
                existingShipment.setStatus(shipmentDto.getStatus());
                existingShipment.setDepartureDate(shipmentDto.getDepartureDate());
                existingShipment.setEstimatedArrival(shipmentDto.getEstimatedArrival());
                existingShipment.setActualArrival(shipmentDto.getActualArrival());
                
                // Handle items update if needed
                // For simplicity, you might want to implement this logic separately
                
                Shipment updatedShipment = shipmentRepository.save(existingShipment);
                return convertToDto(updatedShipment);
            }
            
            return shipmentDto;
        });
    }

    @Override
    public boolean deleteShipment(Long id) {
        return shipmentRepository.findById(id).map(shipment -> {
            shipmentRepository.delete(shipment);
            return true;
        }).orElse(false);
    }

    @Override
    public Optional<ShipmentDto> updateShipmentStatus(Long id, String status) {
        return shipmentRepository.findById(id).map(shipment -> {
            shipment.setStatus(status);
            Shipment updatedShipment = shipmentRepository.save(shipment);
            return convertToDto(updatedShipment);
        });
    }

    @Override
    public List<ShipmentDto> getShipmentsBySource(Long sourceId) {
        return nodeRepository.findById(sourceId)
                .map(node -> shipmentRepository.findBySource(node).stream()
                        .map(this::convertToDto)
                        .collect(Collectors.toList()))
                .orElse(new ArrayList<>());
    }

    @Override
    public List<ShipmentDto> getShipmentsByDestination(Long destinationId) {
        return nodeRepository.findById(destinationId)
                .map(node -> shipmentRepository.findByDestination(node).stream()
                        .map(this::convertToDto)
                        .collect(Collectors.toList()))
                .orElse(new ArrayList<>());
    }

    @Override
    public List<ShipmentDto> getShipmentsByStatus(String status) {
        return shipmentRepository.findByStatus(status).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ShipmentDto> getShipmentsByDateRange(LocalDate startDate, LocalDate endDate, String dateType) {
        return shipmentRepository.findByDateRange(startDate, endDate, dateType).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private ShipmentDto convertToDto(Shipment shipment) {
        ShipmentDto shipmentDto = new ShipmentDto();
        shipmentDto.setId(shipment.getId());
        shipmentDto.setSourceId(shipment.getSource().getId());
        shipmentDto.setSourceName(shipment.getSource().getName());  
        shipmentDto.setDestinationId(shipment.getDestination().getId());
        shipmentDto.setDestinationName(shipment.getDestination().getName()); 
        shipmentDto.setStatus(shipment.getStatus());
        shipmentDto.setDepartureDate(shipment.getDepartureDate());
        shipmentDto.setEstimatedArrival(shipment.getEstimatedArrival());
        shipmentDto.setActualArrival(shipment.getActualArrival());
        
        // Convert shipment items
        if (shipment.getItems() != null && !shipment.getItems().isEmpty()) {
            List<ShipmentItemDto> itemDtos = shipment.getItems().stream()
                    .map(item -> {
                        ShipmentItemDto itemDto = new ShipmentItemDto();
                        itemDto.setId(item.getId());
                        itemDto.setProductId(item.getProduct().getId());
                        itemDto.setProductName(item.getProduct().getName());  
                        itemDto.setQuantity(item.getQuantity());
                        return itemDto;
                    })
                    .collect(Collectors.toList());
            shipmentDto.setItems(itemDtos);
        }
        
        return shipmentDto;
    }
}