import axios from "axios";
export default class UserService {
    constructor() {
        if (typeof window !== 'undefined' && window.localStorage) {
            this.apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT + "/users"; // URL de la API de productos
            this.config = {
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: `Bearer ${localStorage.getItem("AuthToken")}`
                },
            };
        }
    }

    async createUser(name, email, password) {
        try {
            const response = await axios.post(this.apiUrl, { name, email, password }, this.config);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    async getAllUsers() {
        try {
            const response = await axios.get(this.apiUrl, this.config);
          
            return response.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async getUserById(id) {
        try {
            const response = await axios.get(`${this.apiUrl}/${id}`, this.config);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async updateUserById(id, name, email, password) {
        try {
            const response = await axios.put(`${this.apiUrl}/${id}`, { name, email, password }, this.config);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async deleteUserById(id) {
        try {
            const response = await axios.delete(`${this.apiUrl}/${id}`, this.config);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
