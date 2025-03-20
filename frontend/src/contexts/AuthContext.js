import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ Correct way to import
import RoleService from "../services/roleService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");

        if (storedToken) {
            try {
                const decodedUser = jwtDecode(storedToken);
                setUser(decodedUser);
                setIsLoggedIn(true);
                checkAdmin(decodedUser.role); // Ensure isAdmin is set based on role
            } catch (error) {
                console.error("Error decoding stored token:", error);
                logout(); // Clear invalid token
            }
        }
    }, []); // ✅ Run only on mount

    const checkAdmin = async (role) => {
        try {
            const response = await RoleService.getRole();
            setIsAdmin(response || role === "admin"); // ✅ Fallback to role from token
        } catch (error) {
            console.error("Error checking admin role:", error);
        }
    };

    const login = (token) => {
        try {
            const decodedUser = jwtDecode(token);
            localStorage.setItem("authToken", token);
            setUser(decodedUser);
            setIsLoggedIn(true);
            checkAdmin(decodedUser.role); // Set admin state
        } catch (error) {
            console.error("Invalid Token:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        setUser(null);
        setIsLoggedIn(false);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isAdmin, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export { AuthContext };
