package com.swiftServe.Backend.service;

import com.swiftServe.Backend.dto.RestaurantDto;
import com.swiftServe.Backend.entity.Restaurant;
import org.springframework.stereotype.Service;

import java.util.List;


public interface RestaurantService {

    public Restaurant createRestaurant(RestaurantDto dto);
    public Restaurant findById(Long id);
    public List<Restaurant> searchRestaurants(String keyword);
    }

