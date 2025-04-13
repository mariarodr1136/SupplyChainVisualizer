package com.example.supplychainvisualizer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SupplyChainVisualizerApplication {
    public static void main(String[] args) {
        SpringApplication.run(SupplyChainVisualizerApplication.class, args);
    }
}