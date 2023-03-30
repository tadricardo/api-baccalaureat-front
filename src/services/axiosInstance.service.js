import axios from "axios";
import authHeader from './auth-header';
const baseURL = process.env.REACT_APP_URL_API;

let headers = {};

if (localStorage.token) {
  headers.Authorization = authHeader();
  headers.AccessControlAllowOrigin = "*";
}
const axiosInstance = axios.create({
  baseURL: `${baseURL}/api/`,
  headers: {
    Authorization: authHeader(),
    "Access-Control-Allow-Origin": "*"
  },
})

axiosInstance.interceptors.response.use(
  (response) =>
  new Promise((resolve, reject) => {
    resolve(response)
  }),
  (error) => {
    if (!error.response) {
      return new Promise((resolve, reject) => {
        reject(error)
      });
    }
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      window.location = "/login";
      window.location.reload();
    } else {
      return new Promise((resolve, reject) => {
        reject(error)
      });
    }
  }

)

export default axiosInstance
