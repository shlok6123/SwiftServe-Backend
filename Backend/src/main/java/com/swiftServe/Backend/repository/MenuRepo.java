package com.swiftServe.Backend.repository;

import com.swiftServe.Backend.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;


//import java.awt.*;
import java.util.List;

public interface MenuRepo extends JpaRepository<MenuItem,Long> {

    List<MenuItem> findRestaurantById(Long rest_id);

    List<MenuItem> findByRestaurantIdAndIsVeg(Long rest_id,boolean isVeg);

}
