package com.example.supplychainvisualizer.service;

import com.example.supplychainvisualizer.dto.ShipmentDto;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ShipmentService {
    List<ShipmentDto> getAllShipments();
    Optional<ShipmentDto> getShipmentById(Long id);
    ShipmentDto createShipment(ShipmentDto shipmentDto);
    Optional<ShipmentDto> updateShipment(Long id, ShipmentDto shipmentDto);
    boolean deleteShipment(Long id);
    Optional<ShipmentDto> updateShipmentStatus(Long id, String status);
    List<ShipmentDto> getShipmentsBySource(Long sourceId);
    List<ShipmentDto> getShipmentsByDestination(Long destinationId);
    List<ShipmentDto> getShipmentsByStatus(String status);
    List<ShipmentDto> getShipmentsByDateRange(LocalDate startDate, LocalDate endDate, String dateType);
}