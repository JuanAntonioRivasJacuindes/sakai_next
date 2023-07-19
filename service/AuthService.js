import axios from "axios";

export default class AuthService {
  constructor() {
    if (typeof window !== "undefined" && window.localStorage) {
      this.apiUrl = "http://127.0.0.1:8000/api"; // URL de la API de usuarios
      this.config = {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      };
    }
  }
  getLogin(email, password) {
    return axios.post(endpoint + "/login", {
      email: email,
      password: password,
    });
  }

  getLogout() {
    return axios.post(this.apiUrl + "/logout", this.config);
  }
}
