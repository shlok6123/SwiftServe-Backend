package com.swiftServe.Backend.service;

import com.swiftServe.Backend.dto.response.OrderResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

/**
 * Publishes order lifecycle events to STOMP topics so connected clients
 * (customers tracking an order, owners watching their dashboard) receive
 * live updates without polling.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Broadcast the latest state of an order to:
     *  - the per-order topic (customer view), and
     *  - the restaurant's order feed (owner dashboard).
     */
    public void publishOrderUpdate(OrderResponse order) {
        if (order == null || order.getId() == null) {
            return;
        }
        String orderTopic = "/topic/orders/" + order.getId();
        messagingTemplate.convertAndSend(orderTopic, order);

        if (order.getRestaurantId() != null) {
            String restaurantTopic = "/topic/restaurants/" + order.getRestaurantId() + "/orders";
            messagingTemplate.convertAndSend(restaurantTopic, order);
        }

        log.debug("Published order update for order {} (status={})", order.getId(), order.getStatus());
    }
}
