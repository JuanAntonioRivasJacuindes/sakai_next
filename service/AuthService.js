import axios from "axios";

const endpoint = "http://127.0.0.1:8000/api";
require("dotenv").config();
console.log(process.env);
export class AuthService {
  getLogin(email, password) {
    return axios.post(endpoint + "/login", {
      email: email,
      password: password,
    });
  }

  getLogout(AuthToken) {
    const config = {
      headers: { Authorization: `Bearer ${AuthToken}` },
    };
    return axios.post(endpoint + "/logout", {}, config);
  }
}
