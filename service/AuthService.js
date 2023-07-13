import axios from "axios";

const endpoint = process.env.REACT_APP_API_ENDPOINT;

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
