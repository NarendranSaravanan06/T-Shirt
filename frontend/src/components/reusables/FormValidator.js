import React from "react";
import "../../styles/FormValidation.css";

const FormValidator = ({ error }) => {
    return <p className={`error-message ${error ? "" : "hidden"}`}>{error}</p>;
};

export default FormValidator;
