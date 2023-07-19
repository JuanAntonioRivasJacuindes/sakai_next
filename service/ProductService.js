export default class ProductService {
    constructor() {
        if (typeof window !== 'undefined' && window.localStorage) {
            this.apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT + "/products"; // URL de la API de productos
            this.config = {
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: `Bearer ${localStorage.getItem("AuthToken")}`
                },
            };
        }
    }

    async createProduct(name, price) {
        try {
            const response = await axios.post(this.apiUrl, { name, price }, this.config);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getAllProducts() {
        try {
            const response = await axios.get(this.apiUrl, this.config);
            return response.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const response = await axios.get(`${this.apiUrl}/${id}`, this.config);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async updateProductById(id, name, price) {
        try {
            const response = await axios.put(`${this.apiUrl}/${id}`, { name, price }, this.config);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async deleteProductById(id) {
        try {
            const response = await axios.delete(`${this.apiUrl}/${id}`, this.config);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
