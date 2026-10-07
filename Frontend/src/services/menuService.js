import api from './api';

const menuService = {
  updateItem: async (id, data) => {
    const response = await api.put(`/Menu/update/${id}`, data);
    return response.data;
  },
  
  deleteItem: async (id) => {
    const response = await api.delete(`/Menu/delete/${id}`);
    return response.data;
  },

  toggleAvailability: async (id) => {
    const response = await api.patch(`/Menu/toggle/${id}`);
    return response.data;
  }
};

export default menuService;
