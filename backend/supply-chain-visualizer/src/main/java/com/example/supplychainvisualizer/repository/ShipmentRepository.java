package com.example.supplychainvisualizer.repository;

import com.example.supplychainvisualizer.model.Node;
import com.example.supplychainvisualizer.model.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    List<Shipment> findBySource(Node source);
    List<Shipment> findByDestination(Node destination);
    List<Shipment> findByStatus(String status);
    
    @Query("SELECT s FROM Shipment s WHERE " +
           "(:dateType = 'departure' AND s.departureDate BETWEEN :startDate AND :endDate) OR " +
           "(:dateType = 'estimated' AND s.estimatedArrival BETWEEN :startDate AND :endDate) OR " +
           "(:dateType = 'actual' AND s.actualArrival BETWEEN :startDate AND :endDate)")
    List<Shipment> findByDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("dateType") String dateType);
}