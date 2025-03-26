import { useState, useEffect } from "react";
import CartService from "../services/cartService";
import { showToast } from "../utils/toastify";

const useProductCart = (product, selectedColor, selectedSize) => {
    const [isInCart, setIsInCart] = useState(false);
    const [cartQuantity, setCartQuantity] = useState(0);
    const [loadingCart, setLoadingCart] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        setIsLoggedIn(localStorage.getItem("authToken"));
        if (isLoggedIn) {
            if (product && selectedColor && selectedSize) {
                checkIfInCart();
            }
        }

    }, [product, selectedColor, selectedSize]);

    const checkIfInCart = async () => {
        try {
            const cartData = await CartService.getCartById();
            const cartItem = cartData?.cart?.Products?.find(
                (item) =>
                    item.productId === product.productId &&
                    item.variant.color === selectedColor &&
                    item.variant.size === selectedSize
            );

            if (cartItem) {
                setIsInCart(true);
                setCartQuantity(cartItem.variant.stock); // ✅ Get quantity from cart
            } else {
                setIsInCart(false);
                setCartQuantity(0);
            }
        } catch (error) {
            console.error("Error fetching cart data:", error);
        } finally {
            setLoadingCart(false);
        }
    };

    const addToCart = async (quantity) => {
        if (!product || !selectedColor || !selectedSize) return;

        try {
            await CartService.addToCart({
                productId: product.productId,
                color: selectedColor,
                size: selectedSize,
                quantity: quantity, // ✅ Dynamic quantity
            });
            showToast(`Added ${quantity} to cart`, "success");
            setCartQuantity(cartQuantity + quantity);
            setIsInCart(true);
        } catch (error) {
            console.error("Error updating cart:", error);
            showToast("Failed to update cart", "error");
        }
    };

    const removeFromCart = async (quantity) => {
        if (!product || !selectedColor || !selectedSize) return;

        try {
            await CartService.removeFromCart({
                productId: product.productId,
                color: selectedColor,
                size: selectedSize,
            });

            const newQuantity = Math.max(cartQuantity - quantity, 0);
            setCartQuantity(newQuantity);
            if (newQuantity === 0) setIsInCart(false);

            showToast("Removed from cart", "info");
        } catch (error) {
            console.error("Error updating cart:", error);
            showToast("Failed to update cart", "error");
        }
    };

    const fetchCartQuantity = async () => {
        const cartData = await CartService.getCartById();
        const cartItem = cartData?.cart?.Products?.find(
            (item) =>
                item.productId === product.productId &&
                item.variant.color === selectedColor &&
                item.variant.size === selectedSize
        );
        return cartItem ? cartItem.variant.stock : 0;
    };

    return { isInCart, loadingCart, addToCart, removeFromCart, fetchCartQuantity };
};

export default useProductCart;