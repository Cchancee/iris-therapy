import axios from 'axios';


// Function to create Axios instance for public endpoints (publicToken)
export const publicAxios = () => {
  const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      withCredentials: true,  
  });

  const publicToken = localStorage.getItem('publicToken'); // Get publicToken from local storage
  if (publicToken) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${publicToken}`;
  }

  return instance;
};