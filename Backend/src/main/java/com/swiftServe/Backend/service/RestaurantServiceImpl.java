package com.swiftServe.Backend.service;

import com.swiftServe.Backend.dto.RestaurantDto;
import com.swiftServe.Backend.entity.Restaurant;
import com.swiftServe.Backend.entity.User;
import com.swiftServe.Backend.exception.ResourceNotFoundException;
import com.swiftServe.Backend.repository.RestaurantRepo;
import com.swiftServe.Backend.repository.UserRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class RestaurantServiceImpl implements RestaurantService{

    private final RestaurantRepo restaurantRepo;
    private final UserRepo userRepo;

    public RestaurantServiceImpl(RestaurantRepo restaurantRepo, UserRepo userRepo) {
        this.restaurantRepo = restaurantRepo;
        this.userRepo = userRepo;
    }

    @Override
    public Restaurant createRestaurant(RestaurantDto dto) {

       String currentUserEmail= SecurityContextHolder.getContext().getAuthentication().getName();

        User owner=userRepo.findByEmail(currentUserEmail).orElseThrow(()->new ResourceNotFoundException("User Not Found "+currentUserEmail));

        Restaurant restaurant=new Restaurant();
        restaurant.setName(dto.getName());
        restaurant.setAddress(dto.getAddress());
        restaurant.setContactNumber(dto.getContactNumber());
        restaurant.setImageUrl(dto.getImageUrl());
        restaurant.setDescription(dto.getDescription());
        restaurant.setOwner(owner);

        return restaurantRepo.save(restaurant);
    }

    public Restaurant findById(Long id){
        log.info("Finding Restaurant with id: {}", id);
        return restaurantRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("The Restaurant Not found with "+id));
    }

    @Override
    public List<Restaurant> searchRestaurants(String keyword) {
        log.info("Search Restaurants with keyword{}",keyword);
        return restaurantRepo.findByNameContainingIgnoreCase(keyword);
    }
}
