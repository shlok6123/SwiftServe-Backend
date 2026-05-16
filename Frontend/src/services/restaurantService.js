import api from './api';

const restaurantService = {
  getAll: async (keyword = '', page = 0, size = 10) => {
    const response = await api.get(`/restaurants/search?keyword=${keyword}&page=${page}&size=${size}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/restaurants/get/${id}`);
    return response.data;
  },

  getMyRestaurants: async () => {
    const response = await api.get('/restaurants/my');
    return response.data;
  },

  updateRestaurant: async (id, data) => {
    const response = await api.put(`/restaurants/update/${id}`, data);
    return response.data;
  },

  deleteRestaurant: async (id) => {
    const response = await api.delete(`/restaurants/delete/${id}`);
    return response.data;
  }
};

export default restaurantService;
