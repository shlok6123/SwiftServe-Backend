package com.swiftServe.Backend.repository;

import com.swiftServe.Backend.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantRepo extends JpaRepository<Restaurant,Long> {

    List<Restaurant> findByIsOpenTrue();

    List<Restaurant> findByNameContainingIgnoreCase(String name);
}
