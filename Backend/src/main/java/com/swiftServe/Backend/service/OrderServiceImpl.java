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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepo orderRepo;
    private final OrderItemRepo orderItemRepo;
    private final CartService cartService;
    private final UserService userService;
    private final RestaurantRepo restaurantRepo;

    public OrderServiceImpl(OrderRepo orderRepo, OrderItemRepo orderItemRepo, 
                            CartService cartService, UserService userService,
                            RestaurantRepo restaurantRepo) {
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
        this.cartService = cartService;
        this.userService = userService;
        this.restaurantRepo = restaurantRepo;
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

        log.info("Order placed successfully with ID: {} by User: {}", savedOrder.getId(), customer.getEmail());
        return mapToResponse(savedOrder);
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
        User owner = userService.findUserByJwt(jwt);
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!order.getRestaurant().getOwner().getId().equals(owner.getId())) {
            throw new BusinessException("You are not authorized to update this order");
        }

        try {
            OrderStatus newStatus = OrderStatus.valueOf(statusString.toUpperCase());
            order.setStatus(newStatus);
            Order updatedOrder = orderRepo.save(order);
            log.info("Order {} status updated to {}", orderId, newStatus);
            return mapToResponse(updatedOrder);
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Invalid order status: " + statusString);
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
        response.setCreatedAt(order.getCreatedAt());

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
        return response;
    }
}
