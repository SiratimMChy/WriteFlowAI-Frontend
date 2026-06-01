import axios from 'axios';
import { getCookie } from 'cookies-next';

// Utility to recursively map _id to id in responses
function mapId(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(mapId);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      if (key === '_id') {
        newObj.id = obj[key];
      } else {
        newObj[key] = mapId(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  // Try to get token from cookie first
  let token: any = getCookie('token');
  
  // Fallback to localStorage if on client
  if (!token && typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Automatically map _id to id in response payloads
    if (response.data) {
      response.data = mapId(response.data);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
