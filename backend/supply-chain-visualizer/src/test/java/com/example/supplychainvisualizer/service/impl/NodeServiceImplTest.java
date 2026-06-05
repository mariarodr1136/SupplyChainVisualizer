package com.example.supplychainvisualizer.service.impl;

import com.example.supplychainvisualizer.dto.NodeDto;
import com.example.supplychainvisualizer.model.Node;
import com.example.supplychainvisualizer.repository.NodeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NodeServiceImplTest {

    @Mock
    private NodeRepository nodeRepository;

    @InjectMocks
    private NodeServiceImpl nodeService;

    private Node node;

    @BeforeEach
    void setUp() {
        node = new Node();
        node.setId(1L);
        node.setName("Central Warehouse");
        node.setType("warehouse");
        node.setLatitude(25.7617);
        node.setLongitude(-80.1918);
        node.setCapacity(1000);
        node.setStatus("active");
    }

    @Test
    void getAllNodes_returnsMappedDtos() {
        when(nodeRepository.findAll()).thenReturn(List.of(node));

        List<NodeDto> result = nodeService.getAllNodes();

        assertThat(result).hasSize(1);
        NodeDto dto = result.get(0);
        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getName()).isEqualTo("Central Warehouse");
        assertThat(dto.getType()).isEqualTo("warehouse");
        assertThat(dto.getStatus()).isEqualTo("active");
    }

    @Test
    void getAllNodes_empty_returnsEmptyList() {
        when(nodeRepository.findAll()).thenReturn(List.of());

        List<NodeDto> result = nodeService.getAllNodes();

        assertThat(result).isEmpty();
    }

    @Test
    void getNodeById_found_returnsDto() {
        when(nodeRepository.findById(1L)).thenReturn(Optional.of(node));

        Optional<NodeDto> result = nodeService.getNodeById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(1L);
        assertThat(result.get().getName()).isEqualTo("Central Warehouse");
    }

    @Test
    void getNodeById_notFound_returnsEmpty() {
        when(nodeRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<NodeDto> result = nodeService.getNodeById(999L);

        assertThat(result).isEmpty();
    }

    @Test
    void createNode_savesAndReturnsDto() {
        NodeDto dto = new NodeDto();
        dto.setName("Factory Alpha");
        dto.setType("factory");
        dto.setLatitude(34.0522);
        dto.setLongitude(-118.2437);
        dto.setStatus("active");

        Node saved = new Node();
        saved.setId(2L);
        saved.setName("Factory Alpha");
        saved.setType("factory");
        saved.setLatitude(34.0522);
        saved.setLongitude(-118.2437);
        saved.setStatus("active");

        when(nodeRepository.save(any())).thenReturn(saved);

        NodeDto result = nodeService.createNode(dto);

        assertThat(result.getId()).isEqualTo(2L);
        assertThat(result.getName()).isEqualTo("Factory Alpha");
        verify(nodeRepository).save(any(Node.class));
    }

    @Test
    void updateNode_found_updatesAndReturnsDto() {
        NodeDto dto = new NodeDto();
        dto.setName("Updated Warehouse");
        dto.setType("warehouse");
        dto.setLatitude(25.7617);
        dto.setLongitude(-80.1918);
        dto.setStatus("inactive");

        when(nodeRepository.findById(1L)).thenReturn(Optional.of(node));
        when(nodeRepository.save(any())).thenReturn(node);

        Optional<NodeDto> result = nodeService.updateNode(1L, dto);

        assertThat(result).isPresent();
        verify(nodeRepository).save(node);
    }

    @Test
    void updateNode_notFound_returnsEmpty() {
        when(nodeRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<NodeDto> result = nodeService.updateNode(999L, new NodeDto());

        assertThat(result).isEmpty();
        verify(nodeRepository, never()).save(any());
    }

    @Test
    void deleteNode_found_returnsTrue() {
        when(nodeRepository.findById(1L)).thenReturn(Optional.of(node));

        boolean result = nodeService.deleteNode(1L);

        assertThat(result).isTrue();
        verify(nodeRepository).delete(node);
    }

    @Test
    void deleteNode_notFound_returnsFalse() {
        when(nodeRepository.findById(999L)).thenReturn(Optional.empty());

        boolean result = nodeService.deleteNode(999L);

        assertThat(result).isFalse();
        verify(nodeRepository, never()).delete(any());
    }

    @Test
    void getNodesByType_returnsFilteredList() {
        when(nodeRepository.findByType("warehouse")).thenReturn(List.of(node));

        List<NodeDto> result = nodeService.getNodesByType("warehouse");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getType()).isEqualTo("warehouse");
    }

    @Test
    void getNodesByStatus_returnsFilteredList() {
        when(nodeRepository.findByStatus("active")).thenReturn(List.of(node));

        List<NodeDto> result = nodeService.getNodesByStatus("active");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo("active");
    }
}
