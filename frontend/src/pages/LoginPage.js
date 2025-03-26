import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/reusables/Input";
import Button from "../components/reusables/Button";
import FormValidator from "../components/reusables/FormValidator";
import { validateForm } from "../utils/validator";
import AuthService from "../services/authService";
import { showToast } from "../utils/toastify"; // ✅ Import Toastify
import "../styles/AuthPage.css";
import RoleService from "../services/roleService";
const LoginPage = ({setIsLoggedIn}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm({ email, password }, "login");
        setErrors(validationErrors);

        if (Object.values(validationErrors).some(error => error)) {
            return;
        }

        try {
            const response = await AuthService.login({ email, password });
            const isAdmin = await RoleService.getRole();

            if (response.token) {
                setIsLoggedIn(true);
                showToast("Login successful!", "success"); // ✅ Show success toast
                setTimeout(() => {
                    if (isAdmin) {
                        navigate("/admin")
                    }
                    else
                        navigate("/products")
                }, 1500); // ✅ Delay navigation for toast visibility
            } else {
                showToast("Invalid response from server.", "error");
            }
        } catch (error) {
            console.error("Login Error:", error.response);
            showToast(error.response?.data?.message || "Login failed. Please try again.", "error"); // ✅ Show error toast
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <h2>Sign In</h2>
                <form onSubmit={handleLogin}>
                    <div>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <FormValidator error={errors.email} />
                    </div>

                    <div>
                        <Input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <FormValidator error={errors.password} />
                    </div>

                    <Button label="Login" onClick={handleLogin} color="primary" size="medium" />
                </form>

                <div className="register-section">
                    <p>New to our store?</p>
                    <Button label="Create an account" onClick={() => navigate('/register')} color="success" size="medium" />

                </div>
            </div>
        </div>
    );
};

export default LoginPage;