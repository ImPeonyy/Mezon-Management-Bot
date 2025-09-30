// src/utils/axiosClient.js
import axios from "axios";

export const createAxiosClient = (baseURL: string, apiKey: string) => {
  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
    },
    timeout: 10000,
  });

  client.interceptors.request.use(
    (config: any) => {
      console.log("👉 [Request]", config.method?.toUpperCase(), config.baseURL + config.url);
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("❌ [Response Error]", error.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  return client;
};
