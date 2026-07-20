package com.example.supplychainvisualizer.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Kept separate from the application class so web-slice tests
 * (@WebMvcTest) don't try to bootstrap the JPA metamodel.
 */
@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
}
