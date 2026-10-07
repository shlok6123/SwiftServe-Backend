package com.swiftServe.Backend.controller;

import com.swiftServe.Backend.dto.response.ApiResponse;
import com.swiftServe.Backend.entity.Restaurant;
import com.swiftServe.Backend.entity.User;
import com.swiftServe.Backend.repository.RestaurantRepo;
import com.swiftServe.Backend.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final UserRepo userRepo;
    private final RestaurantRepo restaurantRepo;

    @PostMapping("/toggle/{restaurantId}")
    public ResponseEntity<ApiResponse<Boolean>> toggleFavorite(@PathVariable Long restaurantId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email).orElseThrow();
        Restaurant restaurant = restaurantRepo.findById(restaurantId).orElseThrow();

        boolean isFavorite;
        if (user.getFavoriteRestaurants().contains(restaurant)) {
            user.getFavoriteRestaurants().remove(restaurant);
            isFavorite = false;
        } else {
            user.getFavoriteRestaurants().add(restaurant);
            isFavorite = true;
        }
        
        userRepo.save(user);
        return ResponseEntity.ok(new ApiResponse<>(true, isFavorite ? "Added to favorites" : "Removed from favorites", isFavorite));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Restaurant>>> getFavorites() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(new ApiResponse<>(true, "Favorites fetched", user.getFavoriteRestaurants()));
    }
}
