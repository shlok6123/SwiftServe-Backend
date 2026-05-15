package com.swiftServe.Backend.dto.request;

import lombok.Data;

@Data
public class CartItemRequest {

    Long menuItemId;
    int quantity;
}
