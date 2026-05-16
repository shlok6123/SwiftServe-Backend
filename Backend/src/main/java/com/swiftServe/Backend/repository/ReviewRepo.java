package com.swiftServe.Backend.repository;

import com.swiftServe.Backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepo extends JpaRepository<Review, Long> {
    List<Review> findByRestaurantId(Long restaurantId);
}
