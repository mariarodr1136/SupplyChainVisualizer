package com.example.supplychainvisualizer.service;

import com.example.supplychainvisualizer.dto.ConnectionDto;
import java.util.List;
import java.util.Optional;

public interface ConnectionService {

    List<ConnectionDto> getAllConnections();

    Optional<ConnectionDto> getConnectionById(Long id);

    ConnectionDto createConnection(ConnectionDto connectionDto);

    Optional<ConnectionDto> updateConnection(Long id, ConnectionDto connectionDto);

    boolean deleteConnection(Long id);

    List<ConnectionDto> getConnectionsBySource(Long sourceId);

    List<ConnectionDto> getConnectionsByTarget(Long targetId);

    List<ConnectionDto> getConnectionsBySourceAndTarget(Long sourceId, Long targetId);
}