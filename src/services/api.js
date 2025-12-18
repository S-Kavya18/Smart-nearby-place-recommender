import axios from 'axios';

// Use relative base URL so Vite proxy (`vite.config.js`) forwards to the server
// This avoids hardcoding localhost:5000 and prevents CORS/network issues
const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const getPlaceRecommendations = async (requestData) => {
  try {
    console.log('Fetching recommendations from:', API_BASE_URL + '/places/recommendations');
    console.log('Request data:', requestData);
    
    const response = await apiClient.post('/places/recommendations', requestData);
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export default apiClient;
