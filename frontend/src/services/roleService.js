import axiosInstance from "../utils/axiosInstance";

const RoleService = {
    // ✅ Get all products
    getRole: async () => {
        try {
            const response = await axiosInstance.get("/role");
            return response.data;
        } catch (error) {
            throw error.response?.data || "Failed to fetch products";
        }
    },
}
export default RoleService;
