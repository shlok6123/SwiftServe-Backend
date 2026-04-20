package com.swiftServe.Backend.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
public class MenuItem {

    @Id
    private Long menu_id;

    private String name;

    private String description;

    private String category;

    private boolean isVegetarian;



    private LocalDateTime createdAt;
    private BigDecimal price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rest_id")
    private Restaurant restaurant;
}
