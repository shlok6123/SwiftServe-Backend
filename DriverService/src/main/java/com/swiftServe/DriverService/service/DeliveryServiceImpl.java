package com.swiftServe.DriverService.service;

import com.swiftServe.DriverService.dto.DeliveryDto;
import com.swiftServe.DriverService.entity.Delivery;
import com.swiftServe.DriverService.entity.DeliveryStatus;
import com.swiftServe.DriverService.repository.DeliveryRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DeliveryServiceImpl implements DeliveryService {

    private final DeliveryRepo deliveryRepo;

    public DeliveryServiceImpl(DeliveryRepo deliveryRepo) {
        this.deliveryRepo = deliveryRepo;
    }

    @Override
    public Delivery createDelivery(DeliveryDto dto) {
        // Prevent duplicate deliveries for the same order
        Delivery existing = deliveryRepo.findByOrderId(dto.getOrderId());
        if (existing != null) {
            return existing;
        }

        Delivery delivery = new Delivery();
        delivery.setOrderId(dto.getOrderId());
        delivery.setPickupAddress(dto.getPickupAddress());
        delivery.setDropoffAddress(dto.getDropoffAddress());
        delivery.setStatus(DeliveryStatus.PENDING);
        
        return deliveryRepo.save(delivery);
    }

    @Override
    public List<Delivery> getAvailableDeliveries() {
        return deliveryRepo.findByStatus(DeliveryStatus.PENDING);
    }

    @Override
    public List<Delivery> getDeliveriesByDriver(Long driverId) {
        return deliveryRepo.findByDriverId(driverId);
    }

    @Override
    public Delivery acceptDelivery(Long deliveryId, Long driverId) {
        Delivery delivery = deliveryRepo.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        if (delivery.getStatus() != DeliveryStatus.PENDING) {
            throw new RuntimeException("Delivery is no longer available");
        }

        delivery.setDriverId(driverId);
        delivery.setStatus(DeliveryStatus.ACCEPTED);
        
        return deliveryRepo.save(delivery);
    }

    @Override
    public Delivery updateDeliveryStatus(Long deliveryId, DeliveryStatus status, Long driverId) {
        Delivery delivery = deliveryRepo.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        if (!delivery.getDriverId().equals(driverId)) {
            throw new RuntimeException("You are not assigned to this delivery");
        }

        delivery.setStatus(status);
        if (status == DeliveryStatus.DELIVERED) {
            delivery.setDeliveredAt(LocalDateTime.now());
        }

        return deliveryRepo.save(delivery);
    }

    @Override
    public Delivery getDeliveryByOrderId(Long orderId) {
        return deliveryRepo.findByOrderId(orderId);
    }
}
