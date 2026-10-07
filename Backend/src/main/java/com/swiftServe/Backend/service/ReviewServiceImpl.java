package com.swiftServe.Backend.service;

import com.swiftServe.Backend.dto.request.ReviewRequest;
import com.swiftServe.Backend.dto.response.ReviewResponse;
import com.swiftServe.Backend.entity.Restaurant;
import com.swiftServe.Backend.entity.Review;
import com.swiftServe.Backend.entity.User;
import com.swiftServe.Backend.exception.ResourceNotFoundException;
import com.swiftServe.Backend.repository.RestaurantRepo;
import com.swiftServe.Backend.repository.ReviewRepo;
import com.swiftServe.Backend.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl {

    private final ReviewRepo reviewRepo;
    private final RestaurantRepo restaurantRepo;
    private final UserRepo userRepo;

    @Transactional
    public ReviewResponse addReview(ReviewRequest request, String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Restaurant restaurant = restaurantRepo.findById(request.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        Review review = new Review();
        review.setComment(request.getComment());
        review.setRating(request.getRating());
        review.setCustomer(user);
        review.setRestaurant(restaurant);

        Review savedReview = reviewRepo.save(review);
        
        // Update restaurant average rating
        updateRestaurantRating(restaurant);

        return mapToResponse(savedReview);
    }

    public List<ReviewResponse> getRestaurantReviews(Long restaurantId) {
        return reviewRepo.findByRestaurantId(restaurantId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private void updateRestaurantRating(Restaurant restaurant) {
        List<Review> reviews = reviewRepo.findByRestaurantId(restaurant.getId());
        if (reviews.isEmpty()) return;
        
        double avg = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        
        restaurant.setRating(avg);
        restaurantRepo.save(restaurant);
    }

    private ReviewResponse mapToResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setComment(review.getComment());
        response.setRating(review.getRating());
        response.setCustomerName(review.getCustomer().getName());
        response.setCreatedAt(review.getCreatedAt());
        return response;
    }
}
