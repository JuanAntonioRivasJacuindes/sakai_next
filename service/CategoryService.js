import axios from "axios";

export default class CategoryService {
    constructor() {
        if (typeof window !== 'undefined' && window.localStorage) {
            this.apiUrl = process.env.REACT_APP_API_ENDPOINT + "/categories"; // URL de la API de usuarios
            this.config = {
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: `Bearer ${localStorage.getItem("AuthToken")}`
                },
            };

        }
    }

    async createCategory(name, description) {
        try {
            const response = await axios.post(this.apiUrl, { name, description }, this.config);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getAllCategories() {
        try {
            const response = await axios.get(this.apiUrl, this.config);
            return response.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async getCategoryById(id) {
        try {
            const response = await axios.get(`${this.apiUrl}/${id}`, this.config);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async updateCategoryById(id, name, description) {
        try {
            const response = await axios.put(`${this.apiUrl}/${id}`, { name, description }, this.config);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async deleteCategoryById(id) {
        try {
            const response = await axios.delete(`${this.apiUrl}/${id}`, this.config);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
