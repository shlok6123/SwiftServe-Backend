package com.swiftServe.Backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;

import com.swiftServe.Backend.service.CartService;
import com.swiftServe.Backend.entity.Cart;
import com.swiftServe.Backend.dto.request.CartItemRequest;
import com.swiftServe.Backend.dto.request.UpdateCartItemRequest;
import com.swiftServe.Backend.dto.response.ApiResponse;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    private String cleanJwt(String jwt) {
        if (jwt != null && jwt.startsWith("Bearer ")) {
            return jwt.substring(7);
        }
        return jwt;
    }

    @GetMapping("/")
    public ResponseEntity<ApiResponse<Cart>> getCart(@RequestHeader("Authorization") String jwt) {
        Cart cart = cartService.getCart(cleanJwt(jwt));
        ApiResponse<Cart> response = new ApiResponse<>(true, "Cart fetched successfully", cart);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/add-item")
    public ResponseEntity<ApiResponse<Cart>> addItemToCart(@RequestBody CartItemRequest request,
            @RequestHeader("Authorization") String jwt) {
        Cart cart = cartService.addItemToCart(request, cleanJwt(jwt));
        ApiResponse<Cart> response = new ApiResponse<>(true, "Item added to cart", cart);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/update-quantity")
    public ResponseEntity<ApiResponse<Cart>> updateCartItemQuantity(
            @Valid @RequestBody UpdateCartItemRequest request,
            @RequestHeader("Authorization") String jwt) {
        Cart cart = cartService.updateCartItemQuantity(request.getCartItemId(), request.getQuantity(), cleanJwt(jwt));
        ApiResponse<Cart> response = new ApiResponse<>(true, "Cart item updated successfully", cart);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/remove-item/{cartItemId}")
    public ResponseEntity<ApiResponse<Cart>> removeCartItem(
            @PathVariable Long cartItemId,
            @RequestHeader("Authorization") String jwt) {
        Cart cart = cartService.removeCartItem(cartItemId, cleanJwt(jwt));
        ApiResponse<Cart> response = new ApiResponse<>(true, "Item removed from cart", cart);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Cart>> clearCart(@RequestHeader("Authorization") String jwt) {
        Cart cart = cartService.clearCart(cleanJwt(jwt));
        ApiResponse<Cart> response = new ApiResponse<>(true, "Cart cleared successfully", cart);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
