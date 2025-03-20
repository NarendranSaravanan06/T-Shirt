import axiosInstance from "../utils/axiosInstance";

const ProductService = {
    // ✅ Get all products
    getAllProducts: async () => {
        try {
            const response = await axiosInstance.get("/product");
            return response.data;
        } catch (error) {
            throw error.response?.data || "Failed to fetch products";
        }
    },

    // ✅ Get a product by ID
    getProductById: async (productId) => {
        try {
            const response = await axiosInstance.get(`/product/${productId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || "Failed to fetch product details";
        }
    },

    // ✅ Get products by category name
    getProductsByCategory: async (categoryId) => {
        try {
            const response = await axiosInstance.get(`/product/category/${categoryId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || "Failed to fetch products by category";
        }
    },

    // ✅ Create a new product (Admin Only)
    createProduct: async (productData) => {
        try {
            const response = await axiosInstance.post("/product", productData);
            return response.data;
        } catch (error) {
            throw error.response?.data || "Failed to create product";
        }
    },

    // ✅ Update a product (Admin Only)
    updateProduct: async (productId, productData) => {
        try {
            const response = await axiosInstance.put(`/product/${productId}`, productData);
            return response.data;
        } catch (error) {
            throw error.response?.data || "Failed to update product";
        }
    },

    // ✅ Delete a product (Admin Only)
    deleteProduct: async (productId) => {
        try {
            const response = await axiosInstance.delete(`/product/${productId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || "Failed to delete product";
        }
    }
};

export default ProductService;