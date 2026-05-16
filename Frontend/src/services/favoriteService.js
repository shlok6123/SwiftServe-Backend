import api from './api';

const favoriteService = {
  toggleFavorite: async (restaurantId) => {
    const response = await api.post(`/favorites/toggle/${restaurantId}`);
    return response.data;
  },

  getFavorites: async () => {
    const response = await api.get('/favorites/my');
    return response.data;
  }
};

export default favoriteService;
