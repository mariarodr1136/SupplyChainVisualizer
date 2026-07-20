package com.example.supplychainvisualizer.controller;

import com.example.supplychainvisualizer.dto.NodeDto;
import com.example.supplychainvisualizer.security.WebSecurityConfig;
import com.example.supplychainvisualizer.security.jwt.AuthEntryPointJwt;
import com.example.supplychainvisualizer.security.jwt.JwtUtils;
import com.example.supplychainvisualizer.security.services.UserDetailsServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(NodeController.class)
@Import({WebSecurityConfig.class, AuthEntryPointJwt.class})
class NodeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private com.example.supplychainvisualizer.service.NodeService nodeService;

    @MockitoBean
    private JwtUtils jwtUtils;

    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;

    private NodeDto sampleNode() {
        NodeDto dto = new NodeDto();
        dto.setId(1L);
        dto.setName("Warehouse A");
        dto.setType("warehouse");
        dto.setLatitude(40.7);
        dto.setLongitude(-74.0);
        return dto;
    }

    @Test
    void getAllNodesWithoutAuthReturns401() throws Exception {
        mockMvc.perform(get("/api/nodes"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "USER")
    void getAllNodesReturnsNodeList() throws Exception {
        when(nodeService.getAllNodes()).thenReturn(List.of(sampleNode()));

        mockMvc.perform(get("/api/nodes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Warehouse A"))
                .andExpect(jsonPath("$[0].type").value("warehouse"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getNodeByIdReturns404WhenMissing() throws Exception {
        when(nodeService.getNodeById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/nodes/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createNodeWithoutAuthReturns401() throws Exception {
        mockMvc.perform(post("/api/nodes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Warehouse A\",\"type\":\"warehouse\",\"latitude\":40.7,\"longitude\":-74.0}"))
                .andExpect(status().isUnauthorized());

        verify(nodeService, never()).createNode(any());
    }

    @Test
    @WithMockUser(roles = "USER")
    void createNodeReturnsCreatedNode() throws Exception {
        when(nodeService.createNode(any(NodeDto.class))).thenReturn(sampleNode());

        mockMvc.perform(post("/api/nodes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Warehouse A\",\"type\":\"warehouse\",\"latitude\":40.7,\"longitude\":-74.0}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Warehouse A"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void createNodeWithMissingFieldsReturnsFieldErrors() throws Exception {
        mockMvc.perform(post("/api/nodes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"type\":\"warehouse\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.fieldErrors.name").exists())
                .andExpect(jsonPath("$.fieldErrors.latitude").exists());

        verify(nodeService, never()).createNode(any());
    }

    @Test
    @WithMockUser(roles = "USER")
    void updateNodeReturns404WhenMissing() throws Exception {
        when(nodeService.updateNode(eq(99L), any(NodeDto.class))).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/nodes/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Warehouse A\",\"type\":\"warehouse\",\"latitude\":40.7,\"longitude\":-74.0}"))
                .andExpect(status().isNotFound());
    }
}
