package com.example.supplychainvisualizer.repository;

import com.example.supplychainvisualizer.model.Node;
import com.example.supplychainvisualizer.model.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    List<Shipment> findBySource(Node source);
    List<Shipment> findByDestination(Node destination);
    List<Shipment> findByStatus(String status);
    List<Shipment> findByDepartureDateBetween(LocalDateTime start, LocalDateTime end);
    List<Shipment> findByEstimatedArrivalBetween(LocalDateTime start, LocalDateTime end);
}