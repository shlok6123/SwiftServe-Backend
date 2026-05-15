package com.swiftServe.Backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnore // Prevent infinite loop
    private Cart cart;

    @ManyToOne
    private MenuItem menuItem;

    private Integer quantity;
    private Double totalPrice;
}
