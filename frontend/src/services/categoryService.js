import axiosInstance from "../utils/axiosInstance";

const CategoryService = {
    // ✅ Get all categories
    getAllCategories: async () => {
        try {
            
            const response = await axiosInstance.get("/categories");
            return response.data;
            
        } catch (error) {
            throw error.response?.data || "Failed to fetch categories";
        }
    },

    // ✅ Get category by ID
    getCategoryById: async (categoryId) => {
        try {
            const response = await axiosInstance.get(`/categories/${categoryId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || "Failed to fetch category";
        }
    }
};

export default CategoryService;
