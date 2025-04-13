package com.example.supplychainvisualizer.repository;

import com.example.supplychainvisualizer.model.Product;
import com.example.supplychainvisualizer.model.Shipment;
import com.example.supplychainvisualizer.model.ShipmentItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShipmentItemRepository extends JpaRepository<ShipmentItem, Long> {
    List<ShipmentItem> findByShipment(Shipment shipment);
    List<ShipmentItem> findByProduct(Product product);
}