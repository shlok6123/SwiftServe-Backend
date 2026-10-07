package com.swiftServe.Backend.controller;

import com.swiftServe.Backend.dto.request.ReviewRequest;
import com.swiftServe.Backend.dto.response.ApiResponse;
import com.swiftServe.Backend.dto.response.ReviewResponse;
import com.swiftServe.Backend.service.ReviewServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewServiceImpl reviewService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<ReviewResponse>> addReview(@Valid @RequestBody ReviewRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        ReviewResponse response = reviewService.addReview(request, email);
        return ResponseEntity.ok(new ApiResponse<>(true, "Review added successfully", response));
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getRestaurantReviews(@PathVariable Long restaurantId) {
        List<ReviewResponse> reviews = reviewService.getRestaurantReviews(restaurantId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Reviews fetched", reviews));
    }
}
