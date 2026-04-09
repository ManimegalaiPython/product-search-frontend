import axios from 'axios';

const API = axios.create({
  baseURL: 'https://manipython3.pythonanywhere.com/api/',
});

// Search products
export const searchProducts = (query, category, page = 1) => {
  return API.get(`products/?search=${query}&category=${category}&page=${page}`);
};

// Fetch all products (optional)
export const getAllProducts = () => {
  return API.get('products/');
};
