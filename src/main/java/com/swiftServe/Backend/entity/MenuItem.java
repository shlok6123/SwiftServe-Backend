package com.swiftServe.Backend.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
public class MenuItem {

    @Id
    private Long id;

    private String name;

    private String description;

    private String category;

    private boolean isVeg;



    private LocalDateTime createdAt;
    private BigDecimal price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rest_id")
    private Restaurant restaurant;
}
