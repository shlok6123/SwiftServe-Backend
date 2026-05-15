package com.swiftServe.Backend.service;

import com.swiftServe.Backend.dto.request.OrderRequest;
import com.swiftServe.Backend.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderResponse createOrderFromCart(OrderRequest request, String jwt);
    List<OrderResponse> getUserOrders(String jwt);
    List<OrderResponse> getRestaurantOrders(Long restaurantId, String jwt);
    OrderResponse updateOrderStatus(Long orderId, String status, String jwt);
}
