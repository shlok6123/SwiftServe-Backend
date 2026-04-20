package com.swiftServe.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.awt.*;
import java.util.List;

public interface MenuRepo extends JpaRepository<Menu,Long> {

    List<MenuItem> findRestaurantById(Long rest_id);

    List<MenuItem> findByRestaurantIdAndIsVeg(Long rest_id,boolean isVeg);
}
