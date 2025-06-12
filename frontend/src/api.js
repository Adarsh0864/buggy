import axios from 'axios';


const API_BASE_URL = process.env.REACT_APP_API_URL || 
                    (process.env.NODE_ENV === 'production' ? 
                     'https://your-app.railway.app' : 
                     'http://localhost:5001');

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging and error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', 
      error.response?.status, 
      error.config?.url, 
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export const fetchBugs = async () => {
  try {
    const response = await api.get('/bugs');
    return response.data;
  } catch (error) {
    console.error('Error fetching bugs:', error);
    throw error;
  }
};

export const createBug = async (bugData) => {
  try {
    const response = await api.post('/bugs', bugData);
    return response.data;
  } catch (error) {
    console.error('Error creating bug:', error);
    throw error;
  }
};

export const updateBug = async (bugId, bugData) => {
  try {
    const response = await api.put(`/bugs/${bugId}`, bugData);
    return response.data;
  } catch (error) {
    console.error('Error updating bug:', error);
    throw error;
  }
};

export const deleteBug = async (bugId) => {
  try {
    const response = await api.delete(`/bugs/${bugId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting bug:', error);
    throw error;
  }
}; 