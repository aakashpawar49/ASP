import axios from 'axios';

// Create an 'instance' of axios
const api = axios.create({
  // Set the base URL for all API requests
  // This is the URL of your running ASP.NET server
  baseURL: 'http://localhost:5214/api' 
});

/*
  OPTIONAL: This "interceptor" will automatically add the
  auth token (which we'll save to localStorage) to every
  single API request you make. This is a lifesaver.
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;