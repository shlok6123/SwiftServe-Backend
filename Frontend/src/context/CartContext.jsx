import { createContext, useState, useEffect, useContext } from 'react';
import cartService from '../services/cartService';
import { AuthContext } from './AuthContext';
import { useToast } from './ToastContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const toast = useToast();
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
        toast.success('Added to cart');
        return true;
      }
      toast.error(response.message || 'Could not add item to cart');
      return false;
    } catch {
      // api interceptor already shows a toast for the error
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
        toast.info('Item removed from cart');
      }
    } catch (err) {
      console.error('Failed to remove item', err);
    }
  };

  const clearCart = async () => {
    // Optimistically clear locally for instant UI feedback...
    setCart(null);
    setCartItemCount(0);
    // ...then tell the backend so the persisted cart matches.
    try {
      await cartService.clearCart();
    } catch (err) {
      console.error('Failed to clear cart on server', err);
      // Re-sync from server if the clear failed so UI reflects reality.
      fetchCart();
    }
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
