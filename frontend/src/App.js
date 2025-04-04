import React, {useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext"; // ✅ Import AuthProvider
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetail from "./pages/ProductDetail";
import Header from "./components/layouts/Header";
import Sidebar from "./components/layouts/Sidebar";
import Footer from "./components/layouts/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Favorites from "./pages/Favorites";
import CartPage from "./pages/CartPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/Admin/AdminPage";
import AddProduct from "./pages/Admin/AddProduct";
import EditProduct from "./pages/Admin/EditProduct";
import AddCategory from "./pages/Admin/AddCategory";

function ProtectedRoute({ children }) {
    return localStorage.getItem("authToken") ? children : <Navigate to="/" />;
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token);
        console.log("app useEffet", isLoggedIn);
    }
        , [isLoggedIn]);
    return (
        <AuthProvider>
            <Router>
                <ToastContainer />
                <Header setIsLoggedIn={setIsLoggedIn} />
                <Sidebar setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
                        <Route path="/register" element={<RegistrationPage isAdmin={false} />} />
                        <Route path="/register/admin" element={<RegistrationPage isAdmin={true} />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/product/:id" element={<ProductDetail />} />

                        {isLoggedIn ? <>
                            <Route path="/favorite" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                            <Route path='/admin' element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
                            <Route path='/admin/add-product' element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
                            <Route path='/admin/edit-product' element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
                            <Route path='/admin/add-category' element={<ProtectedRoute><AddCategory /></ProtectedRoute>} />
                        </> : null}

                    </Routes>
                </div>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;