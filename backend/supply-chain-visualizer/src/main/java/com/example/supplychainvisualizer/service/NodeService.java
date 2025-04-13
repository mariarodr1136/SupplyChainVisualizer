package com.example.supplychainvisualizer.service;

import com.example.supplychainvisualizer.dto.NodeDto;

import java.util.List;
import java.util.Optional;

public interface NodeService {
    List<NodeDto> getAllNodes();
    Optional<NodeDto> getNodeById(Long id);
    NodeDto createNode(NodeDto nodeDto);
    Optional<NodeDto> updateNode(Long id, NodeDto nodeDto);
    boolean deleteNode(Long id);
    List<NodeDto> getNodesByType(String type);
    List<NodeDto> getNodesByStatus(String status);
}