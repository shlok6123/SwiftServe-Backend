package com.swiftServe.Backend.service;

import com.swiftServe.Backend.dto.request.CartItemRequest;
import com.swiftServe.Backend.entity.Cart;

public interface CartService {

    public Cart addItemToCart(CartItemRequest request,String jwt);
    
    public Cart getCart(String jwt);
    
    public Cart updateCartItemQuantity(Long cartItemId, int quantity, String jwt);
    
    public Cart removeCartItem(Long cartItemId, String jwt);
    
    public Cart clearCart(String jwt);
}
