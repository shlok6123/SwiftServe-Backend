package com.swiftServe.Backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateCartItemRequest {

    @NotNull(message = "Cart Item ID cannot be null")
    private Long cartItemId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;
}
