import axios from "axios";

export default class RoleService {
    constructor() {
        if (typeof window !== 'undefined' && window.localStorage) {
            this.apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT + "/roles"; // URL de la API de usuarios
            this.config = {
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: `Bearer ${localStorage.getItem("AuthToken")}`
                },
            };

        }

    }
    async assignPermissionsToRole(roleId, permissions) {
        try {
            const response = await axios.post(`${this.apiUrl}/${roleId}/permissions`, { permissions }, this.config);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async createRole(name) {
        try {
            const response = await axios.post(this.apiUrl, { name }, this.config);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getAllRoles() {
        try {
            const response = await axios.get(this.apiUrl, this.config);
            return response.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async getRoleById(id) {
        try {
            const response = await axios.get(`${this.apiUrl}/${id}`, this.config);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async updateRoleById(id, name) {
        try {
            const response = await axios.put(`${this.apiUrl}/${id}`, { name }, this.config);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async deleteRoleById(id) {
        try {
            const response = await axios.delete(`${this.apiUrl}/${id}`, this.config);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
