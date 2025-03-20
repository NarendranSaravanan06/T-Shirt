import React, { useEffect, useState } from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import "../../styles/ProductCard.css";
import useProductFavorite from "../../hooks/useProductFavorite";
import discountPercentCalculation from "../../utils/discountPriceCalculation";
const ProductCard = ({ product, variant }) => {
    const navigate = useNavigate();
    const [price, setPrice] = useState({ minPrice: 0, maxPrice: 0 });
    const { isFavorite, loading, handleFavoriteToggle } = useProductFavorite(product.productId, variant.color);

    useEffect(() => {
        if (product?.variants?.length > 0) {
            const prices = product.variants.flatMap(variant => variant.sizes.map(size => size.price));
            if (prices.length > 0) {
                setPrice({
                    minPrice: Math.min(...prices),
                    maxPrice: Math.max(...prices)
                });
            } else {
                setPrice({ minPrice: 0, maxPrice: 0 });
            }
        }
    }, [product]);


    // ✅ Navigate to product detail page with selected variant
    const handleCardClick = () => {
        navigate(`/product/${product.productId}`, { state: { selectedVariant: variant } });
    };


    return (
        <div className="product-card" onClick={handleCardClick}>
            {/* Image Container to prevent layout shifts */}
            <div className="product-image-container">
                {variant?.images?.length > 0 ? (
                    <img src={`/${variant.images[0]}`} alt={variant.color} className="product-image" />
                ) : (
                    <span>No Image</span> // Placeholder text if no image exists
                )}
            </div>

            <h3>{product.productName}</h3>
            <p>{product.productDescription}</p>
            
            {product.discountPercent > 0 &&product.offerIsActive? <><p className="price-discount">{`discount ${product.discountPercent > 0 ? `${product.discountPercent}%` : ``}`}</p>
                <p className="price-before">
                    {`₹${price.minPrice === price.maxPrice ? price.minPrice : `${price.minPrice} - ₹${price.maxPrice}`}`}
                </p>

                <p className="price-after">{`₹${price.minPrice === price.maxPrice
                    ? discountPercentCalculation(price.minPrice, product.discountPercent)
                    : `${discountPercentCalculation(price.minPrice, product.discountPercent)} - ₹${discountPercentCalculation(price.maxPrice, product.discountPercent)}`
                    }`}</p></>
                :<><br/><br/>
                <p className="price-after">{`₹${price.minPrice === price.maxPrice ? price.minPrice : `${price.minPrice} - ₹${price.maxPrice}`}`}</p>
                </>
                
            }
            <div className="button-group">
                {!loading && (
                    <Button
                        label={isFavorite ? "💔 Remove" : "❤️ Favorite"}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleFavoriteToggle();
                        }}
                        color={isFavorite ? "danger" : "secondary"}
                        size="medium"
                    />

                )}
            </div>
        </div>
    );
};

export default ProductCard;
