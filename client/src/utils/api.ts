import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const studentId = localStorage.getItem('studentId');
    if (studentId) {
      config.headers['x-logged-in-user-id'] = studentId;
    }
  }
  return config;
});

export default api;
