package com.swiftServe.Backend.repository;

import com.swiftServe.Backend.entity.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantRepo extends JpaRepository<Restaurant,Long> {

    List<Restaurant> findByIsOpenTrue();

    Page<Restaurant> findByNameContainingIgnoreCase(String name, Pageable pageable);

    List<Restaurant> findByOwnerId(Long ownerId);
}
