import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

export const searchProducts = (query, category, page=1) => {
  return API.get(`products/?search=${query}&category=${category}&page=${page}`);
};