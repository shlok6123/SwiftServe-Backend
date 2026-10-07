import api from './api';

const orderService = {
  checkout: async (deliveryAddress, paymentMethod) => {
    const response = await api.post('/orders/checkout', { deliveryAddress, paymentMethod });
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/orders/history');
    return response.data;
  },

  getRestaurantOrders: async (restaurantId) => {
    const response = await api.get(`/orders/restaurant/${restaurantId}`);
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}/status?status=${status}`);
    return response.data;
  }
};

export default orderService;
