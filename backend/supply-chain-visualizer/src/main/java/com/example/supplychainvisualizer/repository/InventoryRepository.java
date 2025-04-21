package com.example.supplychainvisualizer.repository;

import com.example.supplychainvisualizer.model.Inventory;
import com.example.supplychainvisualizer.model.Node;
import com.example.supplychainvisualizer.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findByNode(Node node);
    
    List<Inventory> findByProduct(Product product);
    
    Optional<Inventory> findByNodeAndProduct(Node node, Product product);
    
    @Query("SELECT i FROM Inventory i WHERE i.quantity <= i.minThreshold AND i.minThreshold IS NOT NULL")
    List<Inventory> findLowStock();
}