package com.swiftServe.Backend.service;

import com.swiftServe.Backend.dto.request.OrderRequest;
import com.swiftServe.Backend.dto.response.OrderItemResponse;
import com.swiftServe.Backend.dto.response.OrderResponse;
import com.swiftServe.Backend.entity.*;
import com.swiftServe.Backend.exception.BusinessException;
import com.swiftServe.Backend.exception.ResourceNotFoundException;
import com.swiftServe.Backend.repository.OrderItemRepo;
import com.swiftServe.Backend.repository.OrderRepo;
import com.swiftServe.Backend.repository.RestaurantRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepo orderRepo;
    private final OrderItemRepo orderItemRepo;
    private final CartService cartService;
    private final UserService userService;
    private final RestaurantRepo restaurantRepo;
    private final RestTemplate restTemplate;
    private final OrderEventPublisher orderEventPublisher;
    private final String driverServiceBaseUrl;

    public OrderServiceImpl(OrderRepo orderRepo,
                            OrderItemRepo orderItemRepo,
                            CartService cartService,
                            UserService userService,
                            RestaurantRepo restaurantRepo,
                            RestTemplate restTemplate,
                            OrderEventPublisher orderEventPublisher,
                            @Value("${swiftserve.driver-service.base-url:http://localhost:8081}") String driverServiceBaseUrl) {
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
        this.cartService = cartService;
        this.userService = userService;
        this.restaurantRepo = restaurantRepo;
        this.restTemplate = restTemplate;
        this.orderEventPublisher = orderEventPublisher;
        this.driverServiceBaseUrl = driverServiceBaseUrl;
    }

    @Override
    @Transactional
    public OrderResponse createOrderFromCart(OrderRequest request, String jwt) {
        User customer = userService.findUserByJwt(jwt);
        Cart cart = cartService.getCart(jwt);

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BusinessException("Cannot place order. Your cart is empty.");
        }

        // We enforced the One Restaurant Rule, so all items belong to the same restaurant
        Restaurant restaurant = cart.getItems().get(0).getMenuItem().getRestaurant();

        Order order = new Order();
        order.setCustomer(customer);
        order.setRestaurant(restaurant);
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setTotalAmount(cart.getTotalAmount());
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentMethod(request.getPaymentMethod());

        if ("ONLINE".equalsIgnoreCase(request.getPaymentMethod())) {
            order.setPaymentStatus(PaymentStatus.PAID);
        } else {
            order.setPaymentStatus(PaymentStatus.PENDING);
        }

        Order savedOrder = orderRepo.save(order);

        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setMenuItem(cartItem.getMenuItem());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setTotalPrice(cartItem.getTotalPrice());
            return orderItem;
        }).collect(Collectors.toList());

        orderItemRepo.saveAll(orderItems);
        savedOrder.setItems(orderItems);

        // Clear the cart after successful checkout
        cartService.clearCart(jwt);

        dispatchToDriverService(savedOrder, restaurant);

        OrderResponse response = mapToResponse(savedOrder);
        orderEventPublisher.publishOrderUpdate(response);

        log.info("Order placed successfully with ID: {} by User: {}", savedOrder.getId(), customer.getEmail());
        return response;
    }

    private void dispatchToDriverService(Order savedOrder, Restaurant restaurant) {
        try {
            String url = driverServiceBaseUrl + "/api/v1/deliveries/create";
            Map<String, Object> deliveryRequest = new HashMap<>();
            deliveryRequest.put("orderId", savedOrder.getId());
            deliveryRequest.put("pickupAddress", restaurant.getAddress());
            deliveryRequest.put("dropoffAddress", savedOrder.getDeliveryAddress());
            restTemplate.postForEntity(url, deliveryRequest, Object.class);
            log.info("Successfully dispatched delivery job to DriverService for order ID: {}", savedOrder.getId());
        } catch (Exception e) {
            // DriverService is best-effort; failure here must not roll back the order.
            log.error("Failed to create delivery in DriverService for order ID: {}. Error: {}",
                    savedOrder.getId(), e.getMessage());
        }
    }

    @Override
    public List<OrderResponse> getUserOrders(String jwt) {
        User customer = userService.findUserByJwt(jwt);
        List<Order> orders = orderRepo.findByCustomerId(customer.getId());
        return orders.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getRestaurantOrders(Long restaurantId, String jwt) {
        User owner = userService.findUserByJwt(jwt);
        Restaurant restaurant = restaurantRepo.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));

        if (!restaurant.getOwner().getId().equals(owner.getId())) {
            throw new BusinessException("You are not authorized to view orders for this restaurant");
        }

        List<Order> orders = orderRepo.findByRestaurantId(restaurantId);
        return orders.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String statusString, String jwt) {
        User user = userService.findUserByJwt(jwt);
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(statusString.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Invalid order status: " + statusString);
        }

        authorizeStatusChange(user, order, newStatus);

        order.setStatus(newStatus);
        Order updatedOrder = orderRepo.save(order);
        log.info("Order {} status updated to {} by user {} ({})",
                orderId, newStatus, user.getEmail(), user.getUserRole());

        OrderResponse response = mapToResponse(updatedOrder);
        orderEventPublisher.publishOrderUpdate(response);
        return response;
    }

    /**
     * Authorization rules for status transitions:
     *  - ADMIN: any transition.
     *  - RESTAURANT_OWNER: any transition for orders belonging to their restaurant.
     *  - DRIVER: only OUT_FOR_DELIVERY, DELIVERED, CANCELLED.
     *  - CUSTOMER: may only cancel their own order while it is still PENDING.
     */
    private void authorizeStatusChange(User user, Order order, OrderStatus newStatus) {
        switch (user.getUserRole()) {
            case ADMIN -> { /* allow */ }
            case RESTAURANT_OWNER -> {
                if (!order.getRestaurant().getOwner().getId().equals(user.getId())) {
                    throw new BusinessException("You are not authorized to update this order");
                }
            }
            case DRIVER -> {
                if (newStatus != OrderStatus.OUT_FOR_DELIVERY
                        && newStatus != OrderStatus.DELIVERED
                        && newStatus != OrderStatus.CANCELLED) {
                    throw new BusinessException("Drivers can only set status to OUT_FOR_DELIVERY, DELIVERED, or CANCELLED");
                }
            }
            case CUSTOMER -> {
                if (!order.getCustomer().getId().equals(user.getId())) {
                    throw new BusinessException("You are not authorized to update this order");
                }
                if (newStatus != OrderStatus.CANCELLED) {
                    throw new BusinessException("Customers can only cancel their order");
                }
                if (order.getStatus() != OrderStatus.PENDING) {
                    throw new BusinessException("Order can no longer be cancelled. Current status: " + order.getStatus());
                }
            }
            default -> throw new BusinessException("You are not authorized to update this order");
        }
    }

    private OrderResponse mapToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setCustomerId(order.getCustomer().getId());
        response.setCustomerName(order.getCustomer().getName());
        response.setRestaurantId(order.getRestaurant().getId());
        response.setRestaurantName(order.getRestaurant().getName());
        response.setDeliveryAddress(order.getDeliveryAddress());
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus());
        response.setPaymentStatus(order.getPaymentStatus());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setCreatedAt(order.getCreatedAt());

        if (order.getItems() != null) {
            List<OrderItemResponse> itemResponses = order.getItems().stream().map(item -> {
                OrderItemResponse itemResponse = new OrderItemResponse();
                itemResponse.setId(item.getId());
                itemResponse.setMenuItemId(item.getMenuItem().getId());
                itemResponse.setMenuItemName(item.getMenuItem().getName());
                itemResponse.setQuantity(item.getQuantity());
                itemResponse.setTotalPrice(item.getTotalPrice());
                return itemResponse;
            }).collect(Collectors.toList());
            response.setItems(itemResponses);
        }

        return response;
    }
}
