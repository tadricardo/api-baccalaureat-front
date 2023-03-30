import axios from "axios";
const API_URL = process.env.REACT_APP_URL_API;

class AuthService {
  async login(email, password) {
    const response = await axios
      .post(`${API_URL}/api/authenticate`, {
        email,
        password
      });
    if (response.data.token) {
      localStorage.setItem("token", JSON.stringify(response.data.token));
    }
    if (response.data.acces) {
      localStorage.setItem("acces", JSON.stringify(response.data.acces));
    }
    return response.data;
  }

  async loginLDAP(email, password) {
    const response = await axios
      .post(`${API_URL}/api/authenticate-LDAP`, {
        email,
        password
      });
    if (response.data.token) {
      localStorage.setItem("token", JSON.stringify(response.data.token));
    }
    if (response.data.acces) {
      localStorage.setItem("acces", JSON.stringify(response.data.acces));
    }
    return response.data;
  }

  forgotPassword(code, password) {
    return axios.post(`${API_URL}/api/forgotten-password/reset`, {
      code,
      password
    })
  }

  sendEmailForForgotPassword(email) {
    return axios.get(`${API_URL}/api/forgotten-password`, {
      params: {
        email: email
      }
    });
  }
}

export default new AuthService();
