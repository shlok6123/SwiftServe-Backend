package com.swiftServe.Backend.service;

import com.swiftServe.Backend.dto.RestaurantDto;
import com.swiftServe.Backend.entity.Restaurant;
import com.swiftServe.Backend.entity.User;
import com.swiftServe.Backend.exception.BusinessException;
import com.swiftServe.Backend.exception.ResourceNotFoundException;
import com.swiftServe.Backend.repository.RestaurantRepo;
import com.swiftServe.Backend.repository.UserRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@Slf4j
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepo restaurantRepo;
    private final UserRepo userRepo;

    public RestaurantServiceImpl(RestaurantRepo restaurantRepo, UserRepo userRepo) {
        this.restaurantRepo = restaurantRepo;
        this.userRepo = userRepo;
    }

    @Override
    public Restaurant createRestaurant(RestaurantDto dto) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User owner = userRepo.findByEmail(currentUserEmail).orElseThrow(() -> new ResourceNotFoundException("User Not Found " + currentUserEmail));

        Restaurant restaurant = new Restaurant();
        restaurant.setName(dto.getName());
        restaurant.setAddress(dto.getAddress());
        restaurant.setContactNumber(dto.getContactNumber());
        restaurant.setImageUrl(dto.getImageUrl());
        restaurant.setDescription(dto.getDescription());
        restaurant.setCuisine(dto.getCuisine());
        restaurant.setOwner(owner);
        restaurant.setIsOpen(true);
        restaurant.setRating(0.0);

        return restaurantRepo.save(restaurant);
    }

    @Override
    public Restaurant findById(Long id) {
        log.info("Finding Restaurant with id: {}", id);
        return restaurantRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("The Restaurant Not found with " + id));
    }

    @Override
    public Page<Restaurant> searchRestaurants(String keyword, Pageable pageable) {
        log.info("Search Restaurants with keyword: {}", keyword);
        return restaurantRepo.findByNameContainingIgnoreCase(keyword, pageable);
    }

    @Override
    public Page<Restaurant> searchWithFilters(String keyword, String cuisine, Double rating, Pageable pageable) {
        if (keyword != null && keyword.trim().isEmpty()) {
            keyword = null;
        }
        if (cuisine != null && cuisine.trim().isEmpty()) {
            cuisine = null;
        }
        log.info("Search with filters - keyword: {}, cuisine: {}, rating: {}", keyword, cuisine, rating);
        return restaurantRepo.searchWithFilters(keyword, cuisine, rating, pageable);
    }

    @Override
    public Restaurant updateRestaurant(Long id, RestaurantDto dto) {
        Restaurant restaurant = restaurantRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));

        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!restaurant.getOwner().getEmail().equals(currentUserEmail)) {
            throw new BusinessException("You are not authorized to update this restaurant");
        }

        restaurant.setName(dto.getName());
        restaurant.setAddress(dto.getAddress());
        restaurant.setContactNumber(dto.getContactNumber());
        restaurant.setDescription(dto.getDescription());
        restaurant.setCuisine(dto.getCuisine());
        if (dto.getImageUrl() != null) {
            restaurant.setImageUrl(dto.getImageUrl());
        }

        log.info("Restaurant updated: {}", restaurant.getName());
        return restaurantRepo.save(restaurant);
    }

    @Override
    public void deleteRestaurant(Long id) {
        Restaurant restaurant = restaurantRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));

        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!restaurant.getOwner().getEmail().equals(currentUserEmail)) {
            throw new BusinessException("You are not authorized to delete this restaurant");
        }

        log.info("Deleting restaurant: {} (ID: {})", restaurant.getName(), id);
        restaurantRepo.delete(restaurant);
    }

    @Override
    public Restaurant toggleOpen(Long id) {
        Restaurant restaurant = restaurantRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));

        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!restaurant.getOwner().getEmail().equals(currentUserEmail)) {
            throw new BusinessException("You are not authorized to update this restaurant");
        }

        boolean newState = !Boolean.TRUE.equals(restaurant.getIsOpen());
        restaurant.setIsOpen(newState);
        log.info("Restaurant {} (id={}) is now {}", restaurant.getName(), id, newState ? "OPEN" : "CLOSED");
        return restaurantRepo.save(restaurant);
    }

    @Override
    public List<Restaurant> getMyRestaurants(String email) {
        User owner = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        return restaurantRepo.findByOwnerId(owner.getId());
    }
}
