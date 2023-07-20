import axios from "axios";

export default class AuthService {
  constructor() {
    if (typeof window !== "undefined" && window.localStorage) {
      this.apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT ; // URL de la API de productos
      this.config = {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      };
    }
  }
  getLogin(email, password) {
    return axios.post(this.apiUrl  + "/login", {
      email: email,
      password: password,
    });
  }

  getLogout() {
    return axios.post(this.apiUrl + "/logout", this.config);
  }
}
