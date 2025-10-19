import axios from 'axios';

// API Base URL - will be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 180000, // 3 minutes (same as Lambda timeout)
});

// API Methods
export const api = {
  // Process a new call
  processCall: async (transcript, linkedinScreenshot, metadata) => {
    const response = await apiClient.post('/calls', {
      transcript,
      linkedinScreenshot,
      metadata,
    });
    return response.data;
  },

  // Get all calls
  getCalls: async (params = {}) => {
    const response = await apiClient.get('/calls', { params });
    return response.data;
  },

  // Get single call detail
  getCall: async (callId) => {
    const response = await apiClient.get(`/calls/${callId}`);
    return response.data;
  },

  // Delete a call
  deleteCall: async (callId) => {
    const response = await apiClient.delete(`/calls/${callId}`);
    return response.data;
  },

  // Query chatbot
  queryChatbot: async (query, filters = null) => {
    const response = await apiClient.post('/chat/query', {
      query,
      filters,
    });
    return response.data;
  },
};

export default apiClient;
