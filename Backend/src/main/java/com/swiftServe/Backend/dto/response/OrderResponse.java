package com.swiftServe.Backend.dto.response;

import com.swiftServe.Backend.entity.OrderStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private Long customerId;
    private String customerName;
    private Long restaurantId;
    private String restaurantName;
    private String deliveryAddress;
    private Double totalAmount;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;
}
