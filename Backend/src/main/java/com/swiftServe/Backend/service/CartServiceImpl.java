package com.swiftServe.Backend.service;

import com.swiftServe.Backend.dto.request.CartItemRequest;
import com.swiftServe.Backend.entity.Cart;
import com.swiftServe.Backend.entity.CartItem;
import com.swiftServe.Backend.entity.MenuItem;
import com.swiftServe.Backend.entity.User;
import com.swiftServe.Backend.repository.CartItemRepo;
import com.swiftServe.Backend.repository.CartRepo;
import com.swiftServe.Backend.repository.MenuItemRepo;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.swiftServe.Backend.exception.BusinessException;
import com.swiftServe.Backend.exception.ResourceNotFoundException;
import java.math.BigDecimal;
import java.util.Optional;

@Service
@Slf4j
public class CartServiceImpl implements CartService {

    private final CartRepo cartRepo;
    private final CartItemRepo cartItemRepo;
    private final MenuItemRepo menuItemRepo;
    private final UserService userService;

    public CartServiceImpl(CartRepo cartRepo, CartItemRepo cartItemRepo,
                           MenuItemRepo menuItemRepo, UserService userService) {
        this.cartRepo = cartRepo;
        this.cartItemRepo = cartItemRepo;
        this.menuItemRepo = menuItemRepo;
        this.userService = userService;
    }

    @Override
    @Transactional
    public Cart addItemToCart(CartItemRequest request, String jwt) {
        // 1. Identify the User from JWT
        User user = userService.findUserByJwt(jwt);

        // 2. Fetch User's Cart or Initialize a new one
        Cart cart = cartRepo.findByCustomerId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setCustomer(user);
                    return cartRepo.save(newCart);
                });

        // 3. Find the MenuItem
        MenuItem menuItem = menuItemRepo.findById(request.getMenuItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Menu Item not found with ID: " + request.getMenuItemId()));

        // 4. ⚠️ INTERVIEW TRAP: THE ONE RESTAURANT RULE
        // Check if the cart is not empty and verify if the restaurant matches
        if (!cart.getItems().isEmpty()) {
            Long existingRestaurantId = cart.getItems().get(0).getMenuItem().getRestaurant().getId();
            Long newRestaurantId = menuItem.getRestaurant().getId();

            if (!existingRestaurantId.equals(newRestaurantId)) {
                throw new BusinessException("Your cart contains items from another restaurant. Please clear your cart first.");
            }
        }

        // 5. Check if item already exists in cart to update quantity vs create new
        CartItem cartItem = cart.getItems().stream()
                .filter(item -> item.getMenuItem().getId().equals(menuItem.getId()))
                .findFirst()
                .orElse(null);

        if (cartItem == null) {
            cartItem = new CartItem();
            cartItem.setMenuItem(menuItem);
            cartItem.setCart(cart);
            cartItem.setQuantity(request.getQuantity());
            cartItem.setTotalPrice(menuItem.getPrice().doubleValue() * request.getQuantity());
            cart.getItems().add(cartItem);
        } else {
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
            cartItem.setTotalPrice(menuItem.getPrice().doubleValue() * cartItem.getQuantity());
        }

        // 6. Recalculate Grand Total
        cart.setTotalAmount(calculateCartTotal(cart));

        log.info("Updated Cart for User: {}. Total Items: {}", user.getEmail(), cart.getItems().size());
        return cartRepo.save(cart);
    }

    @Override
    @Transactional
    public Cart getCart(String jwt) {
        User user = userService.findUserByJwt(jwt);
        return cartRepo.findByCustomerId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setCustomer(user);
                    return cartRepo.save(newCart);
                });
    }

    @Override
    @Transactional
    public Cart updateCartItemQuantity(Long cartItemId, int quantity, String jwt) {
        User user = userService.findUserByJwt(jwt);
        Cart cart = cartRepo.findByCustomerId(user.getId())
                .orElseThrow(() -> new BusinessException("Cart not found for user"));
        
        CartItem cartItem = cartItemRepo.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem not found with id: " + cartItemId));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BusinessException("Item does not belong to your cart");
        }

        cartItem.setQuantity(quantity);
        cartItem.setTotalPrice(cartItem.getMenuItem().getPrice().doubleValue() * quantity);
        cartItemRepo.save(cartItem);

        cart.setTotalAmount(calculateCartTotal(cart));
        return cartRepo.save(cart);
    }

    @Override
    @Transactional
    public Cart removeCartItem(Long cartItemId, String jwt) {
        User user = userService.findUserByJwt(jwt);
        Cart cart = cartRepo.findByCustomerId(user.getId())
                .orElseThrow(() -> new BusinessException("Cart not found for user"));

        CartItem cartItem = cartItemRepo.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem not found with id: " + cartItemId));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BusinessException("Item does not belong to your cart");
        }

        cart.getItems().remove(cartItem);
        cartItemRepo.delete(cartItem);

        cart.setTotalAmount(calculateCartTotal(cart));
        return cartRepo.save(cart);
    }

    @Override
    @Transactional
    public Cart clearCart(String jwt) {
        User user = userService.findUserByJwt(jwt);
        Cart cart = cartRepo.findByCustomerId(user.getId())
                .orElseThrow(() -> new BusinessException("Cart not found for user"));

        cartItemRepo.deleteAll(cart.getItems());
        cart.getItems().clear();
        cart.setTotalAmount(0.0);
        return cartRepo.save(cart);
    }

    private double calculateCartTotal(Cart cart) {
        return cart.getItems().stream()
                .map(item -> item.getTotalPrice() != null ? item.getTotalPrice() : 0.0)
                .mapToDouble(Double::doubleValue)
                .sum();
    }
}