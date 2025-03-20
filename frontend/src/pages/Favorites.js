import React, { useEffect, useState } from "react";
import ProductCard from "../components/reusables/ProductCard";
import favoriteService from "../services/favoriteService";
import productService from "../services/productService";

function Favorites() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const favoriteData = await favoriteService.getFavoriteById();

                if (!favoriteData?.products || favoriteData.products.length === 0) {
                    setProducts([]);
                    return;
                }

                const productDetailsPromises = favoriteData.products.map(async (fav) => {
                    try {
                        const product = await productService.getProductById(fav.productId);
                        if (!product || !product.variants) return null;

                        const matchedVariant = product.variants.find(v => v.color === fav.color);
                        if (!matchedVariant) return null;

                        return {
                            ...product,
                            variant: matchedVariant
                        };
                    } catch (error) {
                        console.error("Error fetching product:", error);
                        return null;
                    }
                });

                const resolvedProducts = await Promise.all(productDetailsPromises);
                setProducts(resolvedProducts.filter(Boolean));
            } catch (error) {
                console.error("Error fetching favorites:", error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <div className="products-grid">
                {products.length > 0 ? (
                    products.map((product, index) => (
                        <ProductCard 
                            key={index} 
                            product={product} 
                            variant={product?.variant} // Ensure variant is defined
                        />
                    ))
                ) : (
                    <p>No favorites found</p>
                )}
            </div>
        </div>
    );
}

export default Favorites;
