package com.swiftServe.DriverService.controller;

import com.swiftServe.DriverService.dto.ApiResponse;
import com.swiftServe.DriverService.dto.DeliveryDto;
import com.swiftServe.DriverService.entity.Delivery;
import com.swiftServe.DriverService.entity.DeliveryStatus;
import com.swiftServe.DriverService.service.DeliveryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/deliveries")
// Simple CORS for development
@CrossOrigin(origins = "*")
public class DeliveryController {

    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    // Called by the main Backend when an order is placed
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Delivery>> createDelivery(@Valid @RequestBody DeliveryDto dto) {
        Delivery delivery = deliveryService.createDelivery(dto);
        return new ResponseEntity<>(new ApiResponse<>(true, "Delivery created successfully", delivery), HttpStatus.CREATED);
    }

    // Called by Drivers to see what is available
    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<Delivery>>> getAvailableDeliveries() {
        List<Delivery> deliveries = deliveryService.getAvailableDeliveries();
        return ResponseEntity.ok(new ApiResponse<>(true, "Available deliveries fetched", deliveries));
    }

    // Called by Drivers to see their current/past jobs
    @GetMapping("/my-deliveries")
    public ResponseEntity<ApiResponse<List<Delivery>>> getMyDeliveries(@RequestHeader("X-Driver-Id") Long driverId) {
        List<Delivery> deliveries = deliveryService.getDeliveriesByDriver(driverId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Driver deliveries fetched", deliveries));
    }

    // Called by Drivers to accept a job
    @PutMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<Delivery>> acceptDelivery(
            @PathVariable Long id, 
            @RequestHeader("X-Driver-Id") Long driverId) {
        Delivery delivery = deliveryService.acceptDelivery(id, driverId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Delivery accepted", delivery));
    }

    // Called by Drivers to update status
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Delivery>> updateStatus(
            @PathVariable Long id,
            @RequestParam DeliveryStatus status,
            @RequestHeader("X-Driver-Id") Long driverId) {
        Delivery delivery = deliveryService.updateDeliveryStatus(id, status, driverId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Delivery status updated", delivery));
    }
}
