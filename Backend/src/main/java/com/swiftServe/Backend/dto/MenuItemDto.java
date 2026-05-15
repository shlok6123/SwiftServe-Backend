package com.swiftServe.Backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Data
public class MenuItemDto {

    @NotBlank(message = "Menu item name cannot be empty")
    private String name;
    
    @NotBlank(message = "Description cannot be empty")
    private String description;
    
    @Positive(message = "Price must be positive")
    private double price;
    
    @NotBlank(message = "Category cannot be empty")
    private String category;
    
    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;
}
