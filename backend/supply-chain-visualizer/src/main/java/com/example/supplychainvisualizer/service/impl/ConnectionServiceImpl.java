package com.example.supplychainvisualizer.service.impl;

import com.example.supplychainvisualizer.dto.ConnectionDto;
import com.example.supplychainvisualizer.service.ConnectionService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ConnectionServiceImpl implements ConnectionService {

    @Override
    public List<ConnectionDto> getAllConnections() {
        return new ArrayList<>();
    }

    @Override
    public Optional<ConnectionDto> getConnectionById(Long id) {
        return Optional.empty();
    }

    @Override
    public ConnectionDto createConnection(ConnectionDto connectionDto) {
        return connectionDto;
    }

    @Override
    public Optional<ConnectionDto> updateConnection(Long id, ConnectionDto connectionDto) {
        return Optional.empty();
    }

    @Override
    public boolean deleteConnection(Long id) {
        return false;
    }

    @Override
    public List<ConnectionDto> getConnectionsBySource(Long sourceId) {
        return new ArrayList<>();
    }

    @Override
    public List<ConnectionDto> getConnectionsByTarget(Long targetId) {
        return new ArrayList<>();
    }

    @Override
    public List<ConnectionDto> getConnectionsBySourceAndTarget(Long sourceId, Long targetId) {
        return new ArrayList<>();
    }
}