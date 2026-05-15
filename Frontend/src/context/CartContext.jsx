import { createContext, useState, useEffect, useContext } from 'react';
import cartService from '../services/cartService';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      setCartItemCount(0);
      return;
    }
    
    try {
      const response = await cartService.getCart();
      if (response.success && response.data) {
        setCart(response.data);
        const count = response.data.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
        setCartItemCount(count);
      }
    } catch (err) {
      console.error('Failed to fetch cart', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (menuItemId, quantity = 1) => {
    try {
      const response = await cartService.addItem(menuItemId, quantity);
      if (response.success) {
        fetchCart(); // Refresh cart to get the latest state
        return true;
      }
    } catch (err) {
      console.error('Failed to add item', err);
      return false;
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const response = await cartService.updateQuantity(cartItemId, quantity);
      if (response.success) {
        fetchCart();
      }
    } catch (err) {
      console.error('Failed to update quantity', err);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const response = await cartService.removeItem(cartItemId);
      if (response.success) {
        fetchCart();
      }
    } catch (err) {
      console.error('Failed to remove item', err);
    }
  };

  const clearCart = async () => {
    setCart(null);
    setCartItemCount(0);
    // Ideally the backend clearCart handles this, or checkout consumes it.
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      cartItemCount, 
      addToCart, 
      updateQuantity, 
      removeItem, 
      fetchCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
