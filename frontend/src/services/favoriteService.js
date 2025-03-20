import axiosInstance from "../utils/axiosInstance";

const API_URL = process.env.REACT_APP_API_BASE_URL + '/favorite';

const addToFavorites = async (favoriteData) => {
    const response = await axiosInstance.post(`${API_URL}/add`, favoriteData);
    return response.data;
};
const removeFromFavorites = async (favoriteData) => {
    const response = await axiosInstance.post(`${API_URL}/remove`, favoriteData);
    return response.data;
};
const getFavoriteById = async () => {
    const response = await axiosInstance.get(`${API_URL}`);
    return response.data;
};
export default { addToFavorites, removeFromFavorites, getFavoriteById };
