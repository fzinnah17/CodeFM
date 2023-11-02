// typeService.js
import axios from 'axios';

const API_URL = '/api/types';

export const getAllTypes = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching types:', error);
    throw error;
  }
};

export const createType = async (typeData) => {
  try {
    const response = await axios.post(API_URL, typeData);
    return response.data;
  } catch (error) {
    console.error('Error creating type:', error);
    throw error;
  }
};

// Add other service functions for update and delete operations as needed