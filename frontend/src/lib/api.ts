import axios from 'axios';
import { Product, PaginatedResponse } from '@/types/product';

const API_BASE_URL =  'http://localhost:3001';

export const api = {
  getProducts: async (
    page = 1,
    limit = 24,
    search?: string,
  ): Promise<PaginatedResponse<Product>> => {
    const response = await axios.get(`${API_BASE_URL}/products`, {
      params: { page, limit, ...(search ? { search } : {}) },
    });
    return response.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  },
};
