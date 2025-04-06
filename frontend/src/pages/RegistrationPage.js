import { showToast } from "../utils/toastify";
import AuthService from '../services/authService';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Input from "../components/reusables/Input";
import Button from "../components/reusables/Button";
import FormValidator from "../components/reusables/FormValidator";
import { validateForm } from "../utils/validator";
import "../styles/AuthPage.css";

const RegistrationPage = ({isAdmin}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm({ name, email, phoneNumber, password, checkPassword }, "register");
        setErrors(validationErrors);

        if (Object.values(validationErrors).some(error => error)) {
            showToast("Please fill all fields correctly!", "warning");
            return;
        }

        try {
            const response = await AuthService.register({ name, email, phoneNumber, password , role: isAdmin ? "admin" : "user"});
            if (response.data) {
                showToast("Registration successful!", "success");
                navigate("/");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Registration failed.";
            showToast(errorMessage, "error");
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
                    <h1>Sign Up</h1>
                    <p>Create your account to get started</p>
                </div>
                <form className="login-form" onSubmit={handleSignUp}>
                    <div className="form-group">
                        <label>
                            <span>Full Name</span>
                            <Input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
                        </label>
                        <FormValidator error={errors.name} />
                    </div>

                    <div className="form-group">
                        <label>
                            <span>Email</span>
                            <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </label>
                        <FormValidator error={errors.email} />
                    </div>

                    <div className="form-group">
                        <label>
                            <span>Phone Number</span>
                            <Input type="text" placeholder="Enter your phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </label>
                        <FormValidator error={errors.phoneNumber} />
                    </div>

                    <div className="form-group">
                        <label>
                            <span>Password</span>
                            <Input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </label>
                        <FormValidator error={errors.password} />
                    </div>

                    <div className="form-group">
                        <label>
                            <span>Confirm Password</span>
                            <Input type="password" placeholder="Confirm password" value={checkPassword} onChange={(e) => setCheckPassword(e.target.value)} />
                        </label>
                        <FormValidator error={errors.checkPassword} />
                    </div>

                    <button type="submit" className="submit-button" onClick={handleSignUp}>
                        <span className="button-text">Create Account</span>
                        <span className="button-loader"></span>
                    </button>
                </form>

                <div className="social-login">
                    <p>Already have an account?</p>
                    <Button label="Login" onClick={() => navigate('/')} color="success" size="medium" />
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;
