package com.example.supplychainvisualizer.repository;

import com.example.supplychainvisualizer.model.Connection;
import com.example.supplychainvisualizer.model.Node;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    List<Connection> findBySource(Node source);
    List<Connection> findByTarget(Node target);
    List<Connection> findBySourceAndTarget(Node source, Node target);
    List<Connection> findByStatus(String status);
}