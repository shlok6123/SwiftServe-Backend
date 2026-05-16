package com.swiftServe.DriverService.entity;

public enum DeliveryStatus {
    PENDING,      // Waiting for a driver to accept
    ACCEPTED,     // Driver accepted, on the way to restaurant
    PICKED_UP,    // Driver picked up the food
    IN_TRANSIT,   // Driver is on the way to the customer
    DELIVERED,    // Food delivered
    CANCELLED
}
