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
        <div className="login-container">
            <div className="login-background">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>
            <div className="login-content">
                <div className="login-header">
                    <h1>Sign In</h1>
                    <p>Welcome back! Please enter your details</p>
                </div>
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>
                            <span>Email</span>
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                        <FormValidator error={errors.email} />
                    </div>

                    <div className="form-group">
                        <label>
                            <span>Password</span>
                            <Input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                        <FormValidator error={errors.password} />
                    </div>

                    <div className="forgot-password">
                        <button type="button" className="text-button">Forgot password?</button>
                    </div>

                    <button type="submit" className="submit-button" onClick={handleLogin}>
                        <span className="button-text">Sign In</span>
                        <span className="button-loader"></span>
                    </button>
                </form>

                <div className="social-login">
                    <p>New to our store?</p>
                    <Button label="Create an account" onClick={() => navigate('/register')} color="success" size="medium" />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
