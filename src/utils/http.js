import axios from "axios";
import TokenService from "./TokenService";
import router from "../router/index";

const baseUrl = "https://api.igenius.uz/api/v1/admin"; // bayavoy


const url = baseUrl;

export const http = axios.create({
  baseURL: url
});
http.interceptors.request.use(config => {
    let token = TokenService.getToken();
    let lang = localStorage.getItem('lang')
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    if(lang)
      config.headers["Language"] = lang
    config.headers["Accept"] = "application/json";
    config.headers["Access-Control-Allow-Origin"] = "*";
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  error => Promise.reject(error)
);

http.interceptors.response.use(res => res,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      TokenService.removeToken();
      TokenService.removeRefreshToken();
      if(router.history.current.name !== 'login') {
        router.push({name: 'login'}).catch(e => e);
      }
    }
    return Promise.reject(error);
  }
);

export default http;
