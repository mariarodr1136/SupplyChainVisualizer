package com.example.supplychainvisualizer.service.impl;

import com.example.supplychainvisualizer.dto.NodeDto;
import com.example.supplychainvisualizer.model.Node;
import com.example.supplychainvisualizer.repository.NodeRepository;
import com.example.supplychainvisualizer.service.NodeService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NodeServiceImpl implements NodeService {

    @Autowired
    private NodeRepository nodeRepository;

    @Override
    public List<NodeDto> getAllNodes() {
        return nodeRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<NodeDto> getNodeById(Long id) {
        return nodeRepository.findById(id).map(this::convertToDto);
    }

    @Override
    public NodeDto createNode(NodeDto nodeDto) {
        Node node = convertToEntity(nodeDto);
        Node savedNode = nodeRepository.save(node);
        return convertToDto(savedNode);
    }

    @Override
    public Optional<NodeDto> updateNode(Long id, NodeDto nodeDto) {
        return nodeRepository.findById(id).map(existingNode -> {
            // Don't update the ID
            nodeDto.setId(id);
            BeanUtils.copyProperties(nodeDto, existingNode, "id", "createdAt");
            Node updatedNode = nodeRepository.save(existingNode);
            return convertToDto(updatedNode);
        });
    }

    @Override
    public boolean deleteNode(Long id) {
        return nodeRepository.findById(id).map(node -> {
            nodeRepository.delete(node);
            return true;
        }).orElse(false);
    }

    @Override
    public List<NodeDto> getNodesByType(String type) {
        return nodeRepository.findByType(type).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<NodeDto> getNodesByStatus(String status) {
        return nodeRepository.findByStatus(status).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private NodeDto convertToDto(Node node) {
        NodeDto nodeDto = new NodeDto();
        BeanUtils.copyProperties(node, nodeDto);
        return nodeDto;
    }

    private Node convertToEntity(NodeDto nodeDto) {
        Node node = new Node();
        BeanUtils.copyProperties(nodeDto, node, "id");
        return node;
    }
}