import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Backend-URL anpassen
});

export default api;
