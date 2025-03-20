import React from "react";
import "../../styles/Footer.css"; // ✅ Styling for the footer

const Footer = () => {
    return (
        <footer className="footer">
            <p>© {new Date().getFullYear()} T-Shirt Store. All Rights Reserved.</p>
        </footer>
    );
};

export default Footer;
