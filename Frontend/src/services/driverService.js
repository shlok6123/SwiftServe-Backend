import axios from 'axios';

const DRIVER_SERVICE_URL = 'http://localhost:8081/api/v1/deliveries';

const getDriverHeaders = (driverId) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (driverId) {
    headers['X-Driver-Id'] = driverId;
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const driverService = {
  getAvailableDeliveries: async () => {
    const response = await axios.get(`${DRIVER_SERVICE_URL}/available`, {
      headers: getDriverHeaders()
    });
    return response.data;
  },

  getMyDeliveries: async (driverId) => {
    const response = await axios.get(`${DRIVER_SERVICE_URL}/my-deliveries`, {
      headers: getDriverHeaders(driverId)
    });
    return response.data;
  },

  acceptDelivery: async (deliveryId, driverId) => {
    const response = await axios.put(`${DRIVER_SERVICE_URL}/${deliveryId}/accept`, {}, {
      headers: getDriverHeaders(driverId)
    });
    return response.data;
  },

  updateDeliveryStatus: async (deliveryId, status, driverId) => {
    const response = await axios.put(`${DRIVER_SERVICE_URL}/${deliveryId}/status?status=${status}`, {}, {
      headers: getDriverHeaders(driverId)
    });
    return response.data;
  }
};

export default driverService;
