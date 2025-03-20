import React, { useState, useEffect } from "react";
import ProductService from "../services/productService";
import CategoryService from "../services/categoryService";
import OfferService from "../services/offerService";
import ProductCard from "../components/reusables/ProductCard";
import Filters from "../components/reusables/Filters";
import "../styles/ProductsPage.css";

const OfferPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedGender, setSelectedGender] = useState("");

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await ProductService.getAllProducts();
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await CategoryService.getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        const query = e.target.value.toLowerCase();
        const filtered = products.filter((p) =>
            p.productName.toLowerCase().includes(query) ||
            p.productDescription.toLowerCase().includes(query)
        );
        setFilteredProducts(filtered);
    };

    const handleFilter = () => {
        let filtered = [...products];

        if (selectedCategory) {
            filtered = filtered.filter((p) => p.categoryName === selectedCategory);
        }

        if (selectedGender) {
            filtered = filtered.filter((p) => p.gender === selectedGender);
        }

        setFilteredProducts(filtered);
    };

    return (
        <div className="products-page">
            <h1>Products</h1>

            {/* Filters Component */}
            <Filters
                searchQuery={searchQuery}
                handleSearch={handleSearch}
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedGender={selectedGender}
                setSelectedGender={setSelectedGender}
                handleFilter={handleFilter}
            />

            {/* Products Grid */}
            <div className="products-grid">
                {filteredProducts.map((product) =>
                    product.variants.map((variant, index) => (
                        <ProductCard key={`${product.productId}-${index}`} product={product} variant={variant} />
                    ))
                )}
            </div>

        </div>
    );
};

export default OfferPage;