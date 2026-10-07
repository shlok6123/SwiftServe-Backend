package com.swiftServe.DriverService.service;

import com.swiftServe.DriverService.dto.DeliveryDto;
import com.swiftServe.DriverService.entity.Delivery;
import com.swiftServe.DriverService.entity.DeliveryStatus;

import java.util.List;

public interface DeliveryService {
    Delivery createDelivery(DeliveryDto dto);
    List<Delivery> getAvailableDeliveries();
    List<Delivery> getDeliveriesByDriver(Long driverId);
    Delivery acceptDelivery(Long deliveryId, Long driverId, String jwt);
    Delivery updateDeliveryStatus(Long deliveryId, DeliveryStatus status, Long driverId, String jwt);
    Delivery getDeliveryByOrderId(Long orderId);
}
