import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import ProductService from "../services/productService";
import useProductFavorite from "../hooks/useProductFavorite";
import useProductCart from "../hooks/useProductCart";
import "../styles/ProductDetail.css";
import discountPercentCalculation from "../utils/discountPriceCalculation";

const ProductDetail = () => {
    const { id } = useParams();
    const location = useLocation(); // ✅ Get navigation state
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(0);

    const [cartQuantity, setCartQuantity] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // ✅ For image slider

    // ✅ Hooks must be at the top level
    const { isFavorite, loadingFavorite, toggleFavorite } = useProductFavorite(product);
    const { isInCart, addToCart, removeFromCart, fetchCartQuantity } = useProductCart(
        product,
        selectedVariant?.color,
        selectedSize
    );

    useEffect(() => {
        fetchProduct();
    }, [id]);
    useEffect(() => {
        if (isInCart) {
            updateCartQuantity();
        }
    }, [isInCart,selectedVariant,selectedSize,selectedPrice]);
    const fetchProduct = async () => {
        try {
            const data = await ProductService.getProductById(id);
            setProduct(data);

            // ✅ Use variant from navigation state if available, else default to first
            setSelectedVariant(location.state?.selectedVariant || data.variants[0]);
            setSelectedSize(location.state?.selectedVariant?.sizes[0].size || data.variants[0].sizes[0].size);
            setSelectedPrice(location.state?.selectedVariant?.sizes[0].price || data.variants[0].sizes[0].price)
            setCurrentImageIndex(0);
        } catch (error) {
            console.error(error);
        }
    };

    // ✅ Get quantity from cart
    const updateCartQuantity = async () => {
        const quantity = await fetchCartQuantity();
        setCartQuantity(quantity || 0);
    };

    // ✅ Handle quantity changes
    const handleIncrease = async () => {
        await addToCart(1);
        setCartQuantity(cartQuantity + 1);
    };

    const handleDecrease = async () => {
        if (cartQuantity > 1) {
            await removeFromCart(1);
            setCartQuantity(cartQuantity - 1);
        } else {
            await removeFromCart(1); // ✅ Last item, remove completely
            setCartQuantity(0);
        }
    };

    // ✅ Handle image slider
    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedVariant.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedVariant.images.length) % selectedVariant.images.length);
    };

    if (!product) return <h1>Loading...</h1>;

    return (
        <div className="product-detail">
            {/* ✅ Image Slider */}
            <div className="image-container">
                <img src={`/${selectedVariant?.images[currentImageIndex]}`} alt={product.productName} />
                <div className="dots">
                    <button className="prev-btn" onClick={prevImage}>&lt;</button>
                    <button className="prev-btn" onClick={nextImage}>&gt;</button>
                </div>
            </div>

            <div className="product-info">
                <h1>{product.productName}</h1>
                <p>{product.productDescription}</p>
                <p><b>Category:</b> {product.categoryName}</p>
                <p><b>Gender:</b> {product.gender}</p>

                {/* ✅ Select Color Variant */}
                <h3>Select Color</h3>
                <div className="variants-container">
                    {product.variants.map((variant, index) => (
                        <div
                            key={index}
                            className={`variant ${selectedVariant?.color === variant.color ? "selected" : ""}`}
                            onClick={() => {
                                setSelectedVariant(variant);
                                setSelectedSize(variant.sizes[0].size);
                                setSelectedPrice(variant.sizes[0].price);
                                setCartQuantity(0); // Reset quantity on variant change
                                setCurrentImageIndex(0); // Reset image index
                            }}
                        >
                            <h4>{variant.color}</h4>
                            <img src={`/${variant.images[0]}`} alt={variant.color} /> {/* ✅ Use First Image */}
                            
                        </div>
                    ))}
                </div>

                {/* ✅ Select Size */}
                <h3>Select Size</h3>
                <div className="size-container">
                    {selectedVariant?.sizes.map((size, index) => (
                        
                        <button
                            key={index}
                            
                            className={`size-btn ${selectedSize === size.size ? "selected" : ""}`}
                            onClick={() => {
                                
                                setSelectedSize(size.size);
                                setSelectedPrice(size.price);
                                setCartQuantity(0);
                            }}
                        >
                            {size.size}
                        </button>
                    ))}
                </div>
                    <div>
                        <h3>Price</h3>
                        {product.discountPercent>0 && product.offerIsActive?
                        <><p className="price-discount"><span className="price-before">₹{selectedPrice}</span> {product.discountPercent}% OFF</p>
                        <p className="price-after">₹{discountPercentCalculation(selectedPrice,product.discountPercent)}</p>
                        </>:<p className="price-after">₹{selectedPrice}</p>}
                    </div>

                <div className="quantity-control">
                    <button onClick={handleIncrease} className="cart-btn">
                        Add to Cart
                    </button>
                </div>

                {/* ✅ Favorite Button */}
                {!loadingFavorite && (
                    <button
                        className={`fav-btn ${isFavorite ? "remove" : "add"}`}
                        onClick={toggleFavorite}
                    >
                        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;