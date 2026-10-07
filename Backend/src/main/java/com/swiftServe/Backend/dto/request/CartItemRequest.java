package com.swiftServe.Backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CartItemRequest {

    @NotNull(message = "Menu Item ID cannot be null")
    private Long menuItemId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;
}
