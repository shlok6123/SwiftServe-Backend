import api from './api';

const orderService = {
  checkout: async (deliveryAddress) => {
    const response = await api.post('/orders/checkout', { deliveryAddress });
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/orders/history');
    return response.data;
  }
};

export default orderService;
