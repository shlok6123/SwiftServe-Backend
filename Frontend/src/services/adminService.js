import api from './api';

const adminService = {
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getRestaurants: async () => {
    const response = await api.get('/admin/restaurants');
    return response.data;
  },

  getOrders: async () => {
    const response = await api.get('/admin/orders');
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  deleteRestaurant: async (id) => {
    const response = await api.delete(`/admin/restaurants/${id}`);
    return response.data;
  }
};

export default adminService;
