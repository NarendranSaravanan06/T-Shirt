import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext"; // ✅ Import Context
import "../../styles/Header.css";
import Button from "../reusables/Button";

const Header = () => {
    const { isLoggedIn, logout } = useContext(AuthContext); // ✅ Use Context
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/"); // ✅ Redirect to home after logout
    };

    return (
        <header className="header">
            <div className="header-button">
                {isLoggedIn ? (
                    <Button onClick={handleLogout} label="LOGOUT" />
                ) : (
                    ""
                )}
            </div>
        </header>
    );
};

export default Header;
