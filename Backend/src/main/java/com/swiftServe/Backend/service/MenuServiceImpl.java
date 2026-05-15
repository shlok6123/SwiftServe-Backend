package com.swiftServe.Backend.service;

import com.swiftServe.Backend.dto.MenuItemDto;
import com.swiftServe.Backend.entity.MenuItem;
import com.swiftServe.Backend.entity.Restaurant;
import com.swiftServe.Backend.exception.ResourceNotFoundException;
import com.swiftServe.Backend.repository.MenuRepo;
import com.swiftServe.Backend.repository.RestaurantRepo;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class MenuServiceImpl implements  MenuService{

    private final MenuRepo menuRepo;
    private final RestaurantRepo restaurantRepo;

    public MenuServiceImpl(MenuRepo menuRepo, RestaurantRepo restaurantRepo) {
        this.menuRepo = menuRepo;
        this.restaurantRepo = restaurantRepo;
    }

    @Override
    public MenuItem addItem(MenuItemDto dto) {
        Restaurant restaurant=restaurantRepo.findById(dto.getRestaurantId()).orElseThrow(()
        ->new ResourceNotFoundException("Restaurant Not Found: "));

        System.out.println("Restaurant id"+restaurant.getId());

        String currentUserEmail= SecurityContextHolder.getContext().getAuthentication().getName();
        if (!restaurant.getOwner().getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("You are not Authorised to Add the item in the menu: ");
        }

        MenuItem item=new MenuItem();
        item.setName(dto.getName());
        item.setCategory(dto.getCategory());
        item.setPrice(BigDecimal.valueOf(dto.getPrice()));
        item.setDescription(dto.getDescription());
        item.setRestaurant(restaurant);

        return menuRepo.save(item);

    }
}
