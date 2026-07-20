package com.example.supplychainvisualizer;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Boots the full application against a real Postgres (via Testcontainers),
 * which exercises the Flyway migrations and JWT auth end to end — the parts
 * unit tests and the H2 demo profile never touch.
 *
 * Skipped automatically when no Docker daemon is available.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers(disabledWithoutDocker = true)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class PostgresIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private TestRestTemplate rest;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    @Order(1)
    void flywayMigrationsCreateSchemaAndSeedData() {
        Integer migrations = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM flyway_schema_history WHERE success", Integer.class);
        assertThat(migrations).isGreaterThanOrEqualTo(2);

        Integer nodeCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM nodes", Integer.class);
        assertThat(nodeCount).isPositive();
    }

    @Test
    @Order(2)
    void protectedEndpointRejectsAnonymousRequests() {
        ResponseEntity<String> response = rest.getForEntity("/api/nodes", String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    @Order(3)
    void registerLoginAndFetchNodesRoundTrip() {
        ResponseEntity<Map> register = rest.postForEntity("/api/auth/register",
                jsonEntity("{\"username\":\"ituser\",\"email\":\"it@example.com\",\"password\":\"password123\"}"),
                Map.class);
        assertThat(register.getStatusCode()).isEqualTo(HttpStatus.OK);

        ResponseEntity<Map> login = rest.postForEntity("/api/auth/login",
                jsonEntity("{\"username\":\"ituser\",\"password\":\"password123\"}"),
                Map.class);
        assertThat(login.getStatusCode()).isEqualTo(HttpStatus.OK);
        String token = (String) login.getBody().get("token");
        assertThat(token).isNotBlank();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        ResponseEntity<String> nodes = rest.exchange(
                "/api/nodes", HttpMethod.GET, new HttpEntity<>(headers), String.class);
        assertThat(nodes.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(nodes.getBody()).contains("\"name\"");
    }

    @Test
    @Order(4)
    void loginWithWrongPasswordReturns401() {
        ResponseEntity<Map> login = rest.postForEntity("/api/auth/login",
                jsonEntity("{\"username\":\"ituser\",\"password\":\"wrong-password\"}"),
                Map.class);
        assertThat(login.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(login.getBody().get("message")).isEqualTo("Invalid credentials");
    }

    private HttpEntity<String> jsonEntity(String body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new HttpEntity<>(body, headers);
    }
}
