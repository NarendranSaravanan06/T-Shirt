import axiosInstance from "../utils/axiosInstance";

const API_URL = process.env.REACT_APP_API_BASE_URL+'/cart';

const addToCart = async (cartData) => {
    const response = await axiosInstance.post(`${API_URL}/add`, cartData);
    return response.data;
};

const removeFromCart = async (cartData) => {
    const response = await axiosInstance.post(`${API_URL}/remove`, cartData);
    return response.data;
};
const getCartById=async () => {
    const response = await axiosInstance.get(`${API_URL}`);
    return response.data;
};
export default { addToCart ,removeFromCart,getCartById};