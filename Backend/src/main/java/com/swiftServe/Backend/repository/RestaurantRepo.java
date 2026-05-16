package com.swiftServe.Backend.repository;

import com.swiftServe.Backend.entity.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantRepo extends JpaRepository<Restaurant,Long> {

    List<Restaurant> findByIsOpenTrue();

    Page<Restaurant> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT r FROM Restaurant r WHERE " +
            "(:keyword IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:cuisine IS NULL OR LOWER(r.cuisine) = LOWER(:cuisine)) AND " +
            "(:rating IS NULL OR r.rating >= :rating)")
    Page<Restaurant> searchWithFilters(
            @org.springframework.data.repository.query.Param("keyword") String keyword,
            @org.springframework.data.repository.query.Param("cuisine") String cuisine,
            @org.springframework.data.repository.query.Param("rating") Double rating,
            Pageable pageable);

    List<Restaurant> findByOwnerId(Long ownerId);
}
