package com.swiftServe.Backend.dto.response;

import lombok.Data;

@Data
public class OrderItemResponse {
    private Long id;
    private Long menuItemId;
    private String menuItemName;
    private int quantity;
    private Double totalPrice;
}
