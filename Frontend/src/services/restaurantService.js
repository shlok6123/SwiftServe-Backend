import api from './api';

const restaurantService = {
  getAll: async (keyword = '') => {
    // The backend only has /search endpoint currently.
    const response = await api.get(`/restaurants/search?keyword=${keyword}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/restaurants/get/${id}`);
    return response.data;
  }
};

export default restaurantService;
