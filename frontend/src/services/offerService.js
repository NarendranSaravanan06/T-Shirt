import axiosInstance from "../utils/axiosInstance";

const API_URL = process.env.REACT_APP_API_BASE_URL + '/offer';

const getOfferById = async (id) => {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
};
const getOffers = async () => {
    const response = await axiosInstance.get(`${API_URL}`);
    return response.data;
};
const getOfferByProductId = async (productId) => {
    const response = await axiosInstance.get(`${API_URL}/product/${productId}`);
    return response.data;
};
const createOffer = async (offerData) => {
    const response = await axiosInstance.post(`${API_URL}`, offerData);
    return response.data;
};
const updateOfferByProductId = async (productId) => {
    const response = await axiosInstance.put(`${API_URL}/product/${productId}`);
    return response.data;
};
const deleteOfferByProductId = async (productId) => {
    const response = await axiosInstance.delete(`${API_URL}/product/${productId}`);
    return response.data;
};

export default { getOfferById,getOffers,getOfferByProductId,createOffer,updateOfferByProductId,deleteOfferByProductId };