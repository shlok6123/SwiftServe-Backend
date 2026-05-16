package com.swiftServe.DriverService.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long orderId;

    // Driver ID can be null initially until a driver accepts it
    private Long driverId;

    @Column(nullable = false, length = 500)
    private String pickupAddress;

    @Column(nullable = false, length = 500)
    private String dropoffAddress;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeliveryStatus status = DeliveryStatus.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime deliveredAt;
}
