import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_BASE_URL+'/auth';

const login = async (user) => {
    const response = await axios.post(`${apiUrl}/login`, user);
    if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
    }
    return response.data;
};

const register = (user) => {
    return axios.post(`${apiUrl}/register`, user);
};

const logout = () => {
    localStorage.removeItem("authToken");  // Clear token on logout
};

const isAuthenticated = () => {
    return !!localStorage.getItem("authToken");  // Check if logged in
};

const AuthService = {
    login,
    register,
    logout,
    isAuthenticated,
};

export default AuthService;
