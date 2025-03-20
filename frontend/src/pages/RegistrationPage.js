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
        <div className="login-wrapper">
            <div className="login-container">
                <h2>Sign Up</h2>
                <form onSubmit={handleSignUp}>
                    <Input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
                    <FormValidator error={errors.name} />

                    <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <FormValidator error={errors.email} />

                    <Input type="text" placeholder="Enter your phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    <FormValidator error={errors.phoneNumber} />

                    <Input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <FormValidator error={errors.password} />

                    <Input type="password" placeholder="Confirm password" value={checkPassword} onChange={(e) => setCheckPassword(e.target.value)} />
                    <FormValidator error={errors.checkPassword} />

                    <Button label="Sign Up" onClick={handleSignUp} color="primary" size="medium" />
                </form>

                <div className="register-section">
                    <p>Already have an account?</p>
                    <Button label="Login" onClick={() => navigate('/')} color="success" size="medium" />
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;