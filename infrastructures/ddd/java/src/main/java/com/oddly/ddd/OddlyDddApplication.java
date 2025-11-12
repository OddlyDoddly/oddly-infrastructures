package com.oddly.ddd;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Main entry point for the Oddly DDD Spring Boot application.
 * 
 * This class bootstraps the application with Spring Boot and configures:
 * - Component scanning for all layers (API, Application, Domain, Infrastructure)
 * - Auto-configuration for Spring Boot features
 * - CORS configuration for cross-origin requests
 * 
 * The application follows Domain-Driven Design (DDD) with CQRS pattern.
 * 
 * @SpringBootApplication enables:
 * - @Configuration: Defines this as a configuration class
 * - @EnableAutoConfiguration: Enables Spring Boot's auto-configuration
 * - @ComponentScan: Scans for components in the base package and sub-packages
 */
@SpringBootApplication
@ComponentScan(basePackages = {
    "com.oddly.ddd.api",
    "com.oddly.ddd.application",
    "com.oddly.ddd.domain",
    "com.oddly.ddd.infrastructure"
})
public class OddlyDddApplication {

    /**
     * Main entry point of the application.
     * 
     * @param p_args Command line arguments
     */
    public static void main(String[] p_args) {
        SpringApplication.run(OddlyDddApplication.class, p_args);
    }

    /**
     * Configure CORS (Cross-Origin Resource Sharing) for the application.
     * 
     * This allows front-end applications running on different origins
     * to make requests to this API.
     * 
     * IMPORTANT: In production, restrict origins to specific domains instead of "*"
     * 
     * @return WebMvcConfigurer with CORS configuration
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry p_registry) {
                p_registry.addMapping("/api/**")
                        .allowedOrigins("*")  // TODO: Restrict in production
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                        .allowedHeaders("*")
                        .exposedHeaders("X-Correlation-Id", "X-Request-Id")
                        .maxAge(3600);
            }
        };
    }
}
