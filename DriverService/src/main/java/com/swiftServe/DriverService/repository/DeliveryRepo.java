package com.swiftServe.DriverService.repository;

import com.swiftServe.DriverService.entity.Delivery;
import com.swiftServe.DriverService.entity.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryRepo extends JpaRepository<Delivery, Long> {
    List<Delivery> findByStatus(DeliveryStatus status);
    List<Delivery> findByDriverId(Long driverId);
    Delivery findByOrderId(Long orderId);
}
