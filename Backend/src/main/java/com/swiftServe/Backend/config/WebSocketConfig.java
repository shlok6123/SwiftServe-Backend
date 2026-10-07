package com.swiftServe.Backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * STOMP-over-WebSocket configuration for real-time order tracking.
 *
 * Clients connect to the handshake endpoint (default {@code /ws}) and then:
 *   - subscribe to {@code /topic/orders/{orderId}} to follow a single order, or
 *   - subscribe to {@code /topic/restaurants/{restaurantId}/orders} for an
 *     owner dashboard feed of new/updated orders.
 *
 * Messages are pushed server-side from {@code OrderEventPublisher}; the client
 * never sends application messages, so no @MessageMapping inbound prefix is needed.
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // In-memory simple broker. Swap for an external broker (RabbitMQ/Redis)
        // when scaling horizontally.
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("http://localhost:3000", "http://localhost:5173")
                .withSockJS();
    }
}
