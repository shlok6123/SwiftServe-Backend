import api from './api';

const reviewService = {
  addReview: async (data) => {
    const response = await api.post('/reviews/add', data);
    return response.data;
  },

  getRestaurantReviews: async (restaurantId) => {
    const response = await api.get(`/reviews/restaurant/${restaurantId}`);
    return response.data;
  }
};

export default reviewService;
