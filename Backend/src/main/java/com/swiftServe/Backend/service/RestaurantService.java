package com.swiftServe.Backend.service;

import com.swiftServe.Backend.dto.RestaurantDto;
import com.swiftServe.Backend.entity.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;


public interface RestaurantService {

    public Restaurant createRestaurant(RestaurantDto dto);
    public Restaurant findById(Long id);
    public Page<Restaurant> searchRestaurants(String keyword, Pageable pageable);
    public Restaurant updateRestaurant(Long id, RestaurantDto dto);
    public void deleteRestaurant(Long id);
    public List<Restaurant> getMyRestaurants(String email);
}

