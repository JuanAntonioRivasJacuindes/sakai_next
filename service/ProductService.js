import axios from "axios";

export default class ProductService {
    constructor() {
        if (typeof window !== "undefined" && window.localStorage) {
            this.apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT + "/products"; // URL de la API de productos
            this.config = {
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
                },
            };
        }
    }

    async createProduct(name, description, price, stock, product_code, category_id, status) {
        try {
            const response = await axios.post(
                this.apiUrl,
                { name, description, price, stock, product_code, category_id, status },
                this.config
            );
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

    async updateProductById(
        id,
        name,
        description,
        price,
        stock,
        product_code,
        category_id,
        status
    ) {
        try {
            const response = await axios.put(
                `${this.apiUrl}/${id}`,{ name, description, price, stock, product_code, category_id, status },
                this.config
            );
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
    async getProductImages(productId) {
        try {
            const response = await axios.get(`${this.apiUrl}/${productId}/images`, this.config);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async uploadImage(productId, imageFile) {

        try {
            const formData = new FormData();
            formData.append("images", imageFile);

            const response = await axios.post(`${this.apiUrl}/${productId}/images`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
                },
            });

            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async deleteImage(imageId) {
        try {
            const response = await axios.delete(`${this.apiUrl}/images/${imageId}`, this.config);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
