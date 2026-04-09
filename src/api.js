import axios from 'axios';

// const API = axios.create({
//   baseURL: 'http://127.0.0.1:8000/api/',
// });

const API = axios.create({
  baseURL: 'https://manipython3.pythonanywhere.com/api/',
});

export const searchProducts = (query, category, page=1) => {
  return API.get(`products/?search=${query}&category=${category}&page=${page}`);
};
