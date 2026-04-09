import axios from 'axios';

// Set the production backend URL
const API = axios.create({
  baseURL: 'https://manipython3.pythonanywhere.com/api/',
});

// Search products with optional query and category
export const searchProducts = (query = '', category = '', page = 1) => {
  const params = new URLSearchParams();
  if (query) params.append('search', query);
  if (category) params.append('category', category);
  if (page) params.append('page', page);

  return API.get(`products/?${params.toString()}`);
};

// Other API calls
export const getProducts = (page = 1) => API.get(`products/?page=${page}`);
export const getBrands = () => API.get('brands/');
export const getStats = () => API.get('stats/');
export const getCategories = () => API.get('categories/');
