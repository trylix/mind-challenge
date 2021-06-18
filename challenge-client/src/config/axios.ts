import axios from 'axios';
import { getTokenBearer } from '../shared/utils/token';
import envs from './envs';

const createAxios = () => {
  const axiosInstance = axios.create({
    baseURL: envs().apiUrl,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const accessToken = getTokenBearer();
      if (accessToken) {
        config.headers.authorization = accessToken;
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    },
  );

  return axiosInstance;
};

export default createAxios();
