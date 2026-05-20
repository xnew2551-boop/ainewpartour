import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ainew_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function setSession(token, user) {
  localStorage.setItem('ainew_token', token);
  localStorage.setItem('ainew_user', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('ainew_token');
  localStorage.removeItem('ainew_user');
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('ainew_user');
  return raw ? JSON.parse(raw) : null;
}
