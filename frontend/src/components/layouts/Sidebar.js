import React, { useState, useEffect } from "react";
import "../../styles/Sidebar.css";
import { Link } from "react-router-dom";
import RoleService from '../../services/roleService'
const Sidebar = ({setIsLoggedIn,isLoggedIn}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            let isMounted = true;

            const checkAdmin = async () => {
                try {
                    const response = await RoleService.getRole();
                    if (isMounted) setIsAdmin(response);
                } catch (error) {
                    console.error("Error checking admin role:", error);
                }
            };

            checkAdmin();

            return () => { isMounted = false; }; // Cleanup function
        }
    }, [isLoggedIn]); // Depend on isLoggedIn
    return (
        <div className={`sidebar-container ${isOpen ? "open" : "closed"}`}>
            {/* Sidebar */}
            <div className="sidebar">
                <ul>

                    {isLoggedIn ? (
                        !isAdmin ? (
                            <>
                                <li><a href="/">Home</a></li>
                                <li><a href="/orders">Orders</a></li>
                                <li><a href="/offers">Offers</a></li>
                                <li><a href="/cart">Cart</a></li>
                                <li><a href="/favorite">Favorites</a></li>
                            </>
                        ) : (
                            <li><a href="/admin">Admin</a></li>
                        )
                    ) : <>
                    <li><a href="/products">Products</a></li>
                    <li><a href="/login">Login</a></li>
                    </>
                    }

                </ul>
            </div>

            {/* Sidebar Toggle Button */}
            <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "✖" : "☰"}
            </button>
            <Link to="/" className="sidebar-header">🛍️ T-Shirt Store</Link>

        </div>
    );
};

export default Sidebar;
