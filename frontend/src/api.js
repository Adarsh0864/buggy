import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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