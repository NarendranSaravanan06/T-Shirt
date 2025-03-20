export const validateForm = (fields, formType = "register") => {
    let errors = {};

    // Name Validation (Only for registration)
    if (formType === "register" && fields.name !== undefined) {
        errors.name = fields.name.trim().length > 2 ? "" : "Name must be at least 3 characters long";
    }

    // Email Validation
    if (!fields.email || fields.email.trim() === "") {
        errors.email = "Email is required";
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        errors.email = emailRegex.test(fields.email) ? "" : "Invalid email format";
    }

    // Phone Number Validation (Only for registration)
    if (formType === "register" && fields.phoneNumber !== undefined) {
        const phoneRegex = /^[6-9]\d{9}$/;
        errors.phoneNumber = fields.phoneNumber.trim() === "" ? "Phone number is required" : 
                         phoneRegex.test(fields.phoneNumber) ? "" : "Invalid phone number";
    }

    // Password Validation
    if (!fields.password || fields.password.trim() === "") {
        errors.password = "Password is required";
    } else if (formType === "register") { // Apply stricter rules only for registration
        if (fields.password.length < 8) {
            errors.password = "Password must be at least 8 characters long";
        } else if (!/[A-Z]/.test(fields.password)) {
            errors.password = "Password must contain at least one uppercase letter";
        } else if (!/\d/.test(fields.password)) {
            errors.password = "Password must contain at least one number";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(fields.password)) {
            errors.password = "Password must contain at least one special character";
        } else {
            errors.password = "";
        }
    }

    // Confirm Password Validation (Only for registration)
    if (formType === "register" && fields.checkPassword !== undefined) {
        errors.checkPassword = fields.checkPassword.trim() === "" ? "Confirm password is required" :
                               fields.password === fields.checkPassword ? "" : "Passwords do not match";
    }

    return errors;
};