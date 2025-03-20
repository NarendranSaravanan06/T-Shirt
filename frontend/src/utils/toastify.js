import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/toastify.css"; // Custom styles

export const showToast = (message, type = "info") => {
    toast[type](message, {
        position: "top-center", 
        autoClose: 3000, 
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        closeButton: true, // ✅ Show close button
        className: "custom-toast", 
        bodyClassName: "custom-toast-body", 
    });
};
