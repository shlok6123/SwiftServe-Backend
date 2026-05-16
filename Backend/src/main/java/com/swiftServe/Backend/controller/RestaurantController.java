package com.swiftServe.Backend.controller;

import com.swiftServe.Backend.dto.RestaurantDto;
import com.swiftServe.Backend.dto.response.ApiResponse;
import com.swiftServe.Backend.entity.Restaurant;
import com.swiftServe.Backend.service.RestaurantService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/v1/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    private String cleanJwt(String jwt) {
        if (jwt != null && jwt.startsWith("Bearer ")) {
            return jwt.substring(7);
        }
        return jwt;
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Restaurant>> createRestaurant(@Valid @RequestBody RestaurantDto dto) {
        Restaurant savedRestaurant = restaurantService.createRestaurant(dto);
        ApiResponse<Restaurant> response = new ApiResponse<>(true, "Restaurant added Successfully", savedRestaurant);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<ApiResponse<Restaurant>> getRestaurantById(@PathVariable Long id) {
        Restaurant savedRestaurant = restaurantService.findById(id);
        ApiResponse<Restaurant> response = new ApiResponse<>(true, "Restaurant Found", savedRestaurant);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Restaurant>> searchRestaurant(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String cuisine,
            @RequestParam(required = false) Double rating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Restaurant> list = restaurantService.searchWithFilters(keyword, cuisine, rating, pageable);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<Restaurant>> updateRestaurant(@PathVariable Long id,
                                                                     @Valid @RequestBody RestaurantDto dto) {
        Restaurant updated = restaurantService.updateRestaurant(id, dto);
        ApiResponse<Restaurant> response = new ApiResponse<>(true, "Restaurant updated successfully", updated);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<String>> deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        ApiResponse<String> response = new ApiResponse<>(true, "Restaurant deleted successfully", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Restaurant>>> getMyRestaurants(
            @RequestHeader("Authorization") String jwt) {
        String email = extractEmail(jwt);
        List<Restaurant> restaurants = restaurantService.getMyRestaurants(email);
        ApiResponse<List<Restaurant>> response = new ApiResponse<>(true, "Your restaurants fetched", restaurants);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private String extractEmail(String jwt) {
        // The service layer handles JWT parsing; we just need to pass the email
        // For now, use SecurityContext since the JWT filter already sets it
        return org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
    }
}
