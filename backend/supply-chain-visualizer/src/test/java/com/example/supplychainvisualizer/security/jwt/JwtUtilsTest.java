package com.example.supplychainvisualizer.security.jwt;

import com.example.supplychainvisualizer.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtUtilsTest {

    @InjectMocks
    private JwtUtils jwtUtils;

    @Mock
    private Authentication authentication;

    private static final String TEST_SECRET =
            "test-secret-key-that-is-at-least-32-bytes-long-for-hmac-sha256";
    private static final int EXPIRATION_MS = 3_600_000;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", TEST_SECRET);
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", EXPIRATION_MS);
    }

    private UserDetailsImpl principalFor(String username) {
        return new UserDetailsImpl(1L, username, username + "@example.com", "password", List.of());
    }

    @Test
    void generateJwtToken_returnsNonNullToken() {
        when(authentication.getPrincipal()).thenReturn(principalFor("alice"));

        String token = jwtUtils.generateJwtToken(authentication);

        assertThat(token).isNotBlank();
    }

    @Test
    void getUserNameFromJwtToken_extractsCorrectUsername() {
        when(authentication.getPrincipal()).thenReturn(principalFor("alice"));
        String token = jwtUtils.generateJwtToken(authentication);

        String username = jwtUtils.getUserNameFromJwtToken(token);

        assertThat(username).isEqualTo("alice");
    }

    @Test
    void validateJwtToken_validToken_returnsTrue() {
        when(authentication.getPrincipal()).thenReturn(principalFor("bob"));
        String token = jwtUtils.generateJwtToken(authentication);

        assertThat(jwtUtils.validateJwtToken(token)).isTrue();
    }

    @Test
    void validateJwtToken_garbageToken_returnsFalse() {
        assertThat(jwtUtils.validateJwtToken("not.a.jwt")).isFalse();
    }

    @Test
    void validateJwtToken_emptyString_returnsFalse() {
        assertThat(jwtUtils.validateJwtToken("")).isFalse();
    }

    @Test
    void validateJwtToken_expiredToken_returnsFalse() {
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", -1000);
        when(authentication.getPrincipal()).thenReturn(principalFor("charlie"));
        String expiredToken = jwtUtils.generateJwtToken(authentication);

        assertThat(jwtUtils.validateJwtToken(expiredToken)).isFalse();
    }

    @Test
    void generateJwtToken_differentUsers_producesDifferentTokens() {
        UserDetailsImpl userA = principalFor("alice");
        UserDetailsImpl userB = principalFor("bob");

        when(authentication.getPrincipal()).thenReturn(userA);
        String tokenA = jwtUtils.generateJwtToken(authentication);

        when(authentication.getPrincipal()).thenReturn(userB);
        String tokenB = jwtUtils.generateJwtToken(authentication);

        assertThat(tokenA).isNotEqualTo(tokenB);
    }
}
