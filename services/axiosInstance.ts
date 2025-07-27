import axios from 'axios';
import {BASE_URL} from './api';
import {getRefreshToken} from './getRefreshToken';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  async config => {
    if (!config.headers) {
      config.headers = {};
    }

    if (config.headers.Authorization) {
    } else if (config.headers.token === 'refresh') {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        config.headers.Authorization = `Bearer ${refreshToken}`;
      }
    }

    delete config.headers.token;

    console.log(
      '📤 Request:',
      JSON.stringify(
        {
          url: config.url,
          // method: config.method,
          // params: config.params,
          // data: config.data,
          // headers: config.headers,
        },
        null,
        2,
      ),
    );

    return config;
  },
  error => {
    console.log('❌ Request error:', JSON.stringify(error, null, 2));
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  response => {
    console.log(
      '📥 Response:',
      JSON.stringify(
        {
          url: response.config.url,
          status: response.status,
          data: response.data,
        },
        null,
        2,
      ),
    );
    return response;
  },
  error => {
    if (error.response) {
      console.log(
        '❌ Response error:',
        JSON.stringify(
          {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
          },
          null,
          2,
        ),
      );
    } else {
      console.log(
        '❌ Response error (no response):',
        JSON.stringify(error.message, null, 2),
      );
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
