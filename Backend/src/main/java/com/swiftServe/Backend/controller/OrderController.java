package com.swiftServe.Backend.controller;

import com.swiftServe.Backend.dto.request.OrderRequest;
import com.swiftServe.Backend.dto.response.ApiResponse;
import com.swiftServe.Backend.dto.response.OrderResponse;
import com.swiftServe.Backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    private String cleanJwt(String jwt) {
        if (jwt != null && jwt.startsWith("Bearer ")) {
            return jwt.substring(7);
        }
        return jwt;
    }

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<OrderResponse>> checkout(
            @Valid @RequestBody OrderRequest request,
            @RequestHeader("Authorization") String jwt) {
        OrderResponse order = orderService.createOrderFromCart(request, cleanJwt(jwt));
        ApiResponse<OrderResponse> response = new ApiResponse<>(true, "Order placed successfully", order);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getUserOrders(
            @RequestHeader("Authorization") String jwt) {
        List<OrderResponse> orders = orderService.getUserOrders(cleanJwt(jwt));
        ApiResponse<List<OrderResponse>> response = new ApiResponse<>(true, "Order history fetched successfully", orders);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getRestaurantOrders(
            @PathVariable Long restaurantId,
            @RequestHeader("Authorization") String jwt) {
        List<OrderResponse> orders = orderService.getRestaurantOrders(restaurantId, cleanJwt(jwt));
        ApiResponse<List<OrderResponse>> response = new ApiResponse<>(true, "Restaurant orders fetched successfully", orders);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status,
            @RequestHeader("Authorization") String jwt) {
        OrderResponse order = orderService.updateOrderStatus(orderId, status, cleanJwt(jwt));
        ApiResponse<OrderResponse> response = new ApiResponse<>(true, "Order status updated successfully", order);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
