import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../services/productService";
import ProductCard from "../components/reusables/ProductCard";
import "../styles/HomePage.css"; // Import the new CSS file

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await ProductService.getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="home-page">
            <h1>DARK AURA</h1>
            <h2>New Arrivals</h2>
            <div className="home-products-grid">

                {products
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 3)
                    .map((product) => (
                        <ProductCard
                            key={product.productId}
                            product={product}
                            variant={product.variants[0]}
                            className="home-product-card"
                        />
                    ))}
            </div>
            <h2>Hoodie Collections</h2>
            <div className="home-products-grid">

                {products
                    .filter((product) => product.categoryName === "Hoodie")
                    .map((product) => (
                        <ProductCard
                            key={product.productId}
                            product={product}
                            variant={product.variants[0]}
                            className="home-product-card"
                        />
                    ))}
            </div>
            <button className="home-view-all-btn" onClick={() => navigate("/products")}>
                View All Products
            </button>
        </div>
    );
};

export default HomePage;
