package com.swiftServe.Backend.repository;

import com.swiftServe.Backend.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepo extends JpaRepository<Cart, Long> {
    Optional<Cart> findByCustomerId(Long id);
}
