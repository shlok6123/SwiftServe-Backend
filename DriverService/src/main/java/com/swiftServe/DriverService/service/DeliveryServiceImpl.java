package com.swiftServe.DriverService.service;

import com.swiftServe.DriverService.dto.DeliveryDto;
import com.swiftServe.DriverService.entity.Delivery;
import com.swiftServe.DriverService.entity.DeliveryStatus;
import com.swiftServe.DriverService.repository.DeliveryRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;

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
    public Delivery acceptDelivery(Long deliveryId, Long driverId, String jwt) {
        Delivery delivery = deliveryRepo.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        if (delivery.getStatus() != DeliveryStatus.PENDING) {
            throw new RuntimeException("Delivery is no longer available");
        }

        delivery.setDriverId(driverId);
        delivery.setStatus(DeliveryStatus.ACCEPTED);
        
        Delivery saved = deliveryRepo.save(delivery);
        updateCentralOrderStatus(delivery.getOrderId(), "OUT_FOR_DELIVERY", jwt);
        return saved;
    }

    @Override
    public Delivery updateDeliveryStatus(Long deliveryId, DeliveryStatus status, Long driverId, String jwt) {
        Delivery delivery = deliveryRepo.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        if (!delivery.getDriverId().equals(driverId)) {
            throw new RuntimeException("You are not assigned to this delivery");
        }

        delivery.setStatus(status);
        if (status == DeliveryStatus.DELIVERED) {
            delivery.setDeliveredAt(LocalDateTime.now());
            updateCentralOrderStatus(delivery.getOrderId(), "DELIVERED", jwt);
        } else if (status == DeliveryStatus.CANCELLED) {
            updateCentralOrderStatus(delivery.getOrderId(), "CANCELLED", jwt);
        } else {
            updateCentralOrderStatus(delivery.getOrderId(), "OUT_FOR_DELIVERY", jwt);
        }

        return deliveryRepo.save(delivery);
    }

    @Override
    public Delivery getDeliveryByOrderId(Long orderId) {
        return deliveryRepo.findByOrderId(orderId);
    }

    private void updateCentralOrderStatus(Long orderId, String status, String jwt) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://localhost:8080/api/v1/orders/" + orderId + "/status?status=" + status;
            
            HttpHeaders headers = new HttpHeaders();
            if (jwt != null) {
                headers.set("Authorization", jwt.startsWith("Bearer ") ? jwt : "Bearer " + jwt);
            }
            
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            restTemplate.exchange(url, HttpMethod.PUT, entity, Object.class);
        } catch (Exception e) {
            System.err.println("Failed to sync status to Backend for order " + orderId + ": " + e.getMessage());
        }
    }
}
