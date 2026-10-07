package com.swiftServe.Backend.service;

import com.swiftServe.Backend.dto.MenuItemDto;
import com.swiftServe.Backend.entity.MenuItem;
import com.swiftServe.Backend.entity.Restaurant;
import com.swiftServe.Backend.exception.ResourceNotFoundException;
import com.swiftServe.Backend.repository.MenuRepo;
import com.swiftServe.Backend.repository.RestaurantRepo;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional
public class MenuServiceImpl implements MenuService {

    private final MenuRepo menuRepo;
    private final RestaurantRepo restaurantRepo;

    public MenuServiceImpl(MenuRepo menuRepo, RestaurantRepo restaurantRepo) {
        this.menuRepo = menuRepo;
        this.restaurantRepo = restaurantRepo;
    }

    @Override
    public MenuItem addItem(MenuItemDto dto) {
        Restaurant restaurant = restaurantRepo.findById(dto.getRestaurantId()).orElseThrow(()
                -> new ResourceNotFoundException("Restaurant Not Found: "));

        System.out.println("Restaurant id" + restaurant.getId());

        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!restaurant.getOwner().getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("You are not Authorised to Add the item in the menu: ");
        }

        MenuItem item = new MenuItem();
        item.setName(dto.getName());
        item.setCategory(dto.getCategory());
        item.setPrice(BigDecimal.valueOf(dto.getPrice()));
        item.setDescription(dto.getDescription());
        item.setIsVeg(dto.getIsVeg() != null ? dto.getIsVeg() : false);
        item.setIsAvailable(dto.getIsAvailable() != null ? dto.getIsAvailable() : true);
        item.setImageUrl(dto.getImageUrl());
        item.setRestaurant(restaurant);

        return menuRepo.save(item);
    }

    @Override
    public MenuItem updateItem(Long id, MenuItemDto dto) {
        MenuItem item = menuRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu Item not found with id: " + id));

        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!item.getRestaurant().getOwner().getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("You are not authorized to update this menu item");
        }

        item.setName(dto.getName());
        item.setDescription(dto.getDescription());
        item.setCategory(dto.getCategory());
        item.setPrice(BigDecimal.valueOf(dto.getPrice()));
        if (dto.getIsVeg() != null) item.setIsVeg(dto.getIsVeg());
        if (dto.getIsAvailable() != null) item.setIsAvailable(dto.getIsAvailable());
        if (dto.getImageUrl() != null) item.setImageUrl(dto.getImageUrl());

        return menuRepo.save(item);
    }

    @Override
    public void deleteItem(Long id) {
        MenuItem item = menuRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu Item not found with id: " + id));

        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!item.getRestaurant().getOwner().getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("You are not authorized to delete this menu item");
        }

        menuRepo.delete(item);
    }

    @Override
    public MenuItem toggleAvailability(Long id) {
        MenuItem item = menuRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu Item not found with id: " + id));

        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!item.getRestaurant().getOwner().getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("You are not authorized to modify this menu item");
        }

        item.setIsAvailable(!item.getIsAvailable());
        return menuRepo.save(item);
    }
}
