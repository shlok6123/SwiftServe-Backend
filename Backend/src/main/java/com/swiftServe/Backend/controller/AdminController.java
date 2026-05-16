package com.swiftServe.Backend.controller;

import com.swiftServe.Backend.dto.response.ApiResponse;
import com.swiftServe.Backend.dto.response.OrderResponse;
import com.swiftServe.Backend.dto.response.UserResponse;
import com.swiftServe.Backend.entity.Order;
import com.swiftServe.Backend.entity.Restaurant;
import com.swiftServe.Backend.entity.User;
import com.swiftServe.Backend.repository.OrderRepo;
import com.swiftServe.Backend.repository.RestaurantRepo;
import com.swiftServe.Backend.repository.UserRepo;
import com.swiftServe.Backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepo userRepo;
    private final RestaurantRepo restaurantRepo;
    private final OrderRepo orderRepo;
    private final OrderService orderService; // To use its mapping logic

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<User> users = userRepo.findAll();
        List<UserResponse> response = users.stream().map(user -> {
            UserResponse res = new UserResponse();
            res.setId(user.getId());
            res.setName(user.getName());
            res.setEmail(user.getEmail());
            res.setUserRole(user.getUserRole());
            return res;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(new ApiResponse<>(true, "All users fetched", response));
    }

    @GetMapping("/restaurants")
    public ResponseEntity<ApiResponse<List<Restaurant>>> getAllRestaurants() {
        List<Restaurant> restaurants = restaurantRepo.findAll();
        return ResponseEntity.ok(new ApiResponse<>(true, "All restaurants fetched", restaurants));
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
        List<Order> orders = orderRepo.findAll();
        // Since OrderService mapping logic might be private or tied to specific logic, 
        // we'll implement a basic mapping here or call the service if available.
        // For simplicity, let's assume we want to see everything.
        List<OrderResponse> response = orders.stream()
                .map(order -> {
                    // We can reuse the mapToResponse logic if we make it public in OrderServiceImpl
                    // or just implement it here for now.
                    OrderResponse res = new OrderResponse();
                    res.setId(order.getId());
                    res.setCustomerName(order.getCustomer().getName());
                    res.setRestaurantName(order.getRestaurant().getName());
                    res.setTotalAmount(order.getTotalAmount());
                    res.setStatus(order.getStatus());
                    res.setCreatedAt(order.getCreatedAt());
                    return res;
                }).collect(Collectors.toList());
        
        return ResponseEntity.ok(new ApiResponse<>(true, "All orders fetched", response));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
        userRepo.deleteById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "User deleted successfully", null));
    }

    @DeleteMapping("/restaurants/{id}")
    public ResponseEntity<ApiResponse<String>> deleteRestaurant(@PathVariable Long id) {
        restaurantRepo.deleteById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Restaurant deleted successfully", null));
    }
}
