import axios from 'axios';
import { getTokenBearer } from '../shared/utils/token';

const createAxios = () => {
  const axiosInstance = axios.create({
    baseURL: 'https://conduit.productionready.io/api',
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const accessToken = getTokenBearer();
      if (accessToken) {
        config.headers.authorization = `Bearer ${accessToken}`;
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
