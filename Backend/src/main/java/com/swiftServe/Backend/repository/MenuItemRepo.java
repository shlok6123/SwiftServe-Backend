package com.swiftServe.Backend.repository;

import com.swiftServe.Backend.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuItemRepo extends JpaRepository<MenuItem, Long> {
}
