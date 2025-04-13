package com.example.supplychainvisualizer.repository;

import com.example.supplychainvisualizer.model.Node;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NodeRepository extends JpaRepository<Node, Long> {
    List<Node> findByStatus(String status);
    List<Node> findByType(String type);
}