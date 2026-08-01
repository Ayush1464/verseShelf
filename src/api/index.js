import axios from 'axios';

// Connect to Django default development port 8000
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

export default API;
