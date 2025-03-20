import React from "react";
import "../../styles/Button.css";

const Button = ({ label, onClick, color = "primary", size = "medium", disabled = false }) => {
  return (
    <button className={`btn ${color} ${size}`} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default Button;