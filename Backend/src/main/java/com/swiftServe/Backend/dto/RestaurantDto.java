package com.swiftServe.Backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class RestaurantDto {
    @NotBlank(message = "Restaurant name is required")
    private String name;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotBlank(message = "Address is required")
    private String address;
    
    @NotBlank(message = "Contact number is required")
    private String contactNumber;
    
    private String imageUrl;
}
