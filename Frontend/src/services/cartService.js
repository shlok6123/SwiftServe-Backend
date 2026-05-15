import api from './api';

const cartService = {
  getCart: async () => {
    const response = await api.get('/cart/');
    return response.data;
  },

  addItem: async (menuItemId, quantity) => {
    const response = await api.post('/cart/add-item', { menuItemId, quantity });
    return response.data;
  },

  updateQuantity: async (cartItemId, quantity) => {
    const response = await api.put('/cart/update-quantity', { cartItemId, quantity });
    return response.data;
  },

  removeItem: async (cartItemId) => {
    const response = await api.delete(`/cart/remove-item/${cartItemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  }
};

export default cartService;
