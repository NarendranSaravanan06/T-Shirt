import { useState, useEffect } from "react";
import FavoriteService from "../services/favoriteService";
import { showToast } from "../utils/toastify";

const useProductFavorite = (productId, color) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkIfFavorite = async () => {
            try {
                setLoading(true);
                const favoriteData = await FavoriteService.getFavoriteById(); // ✅ Auth token handles userId

                const isFav = favoriteData?.products?.some(fav => fav.productId === productId) && favoriteData?.products?.some(fav => fav.color === color);
                setIsFavorite(isFav);
            } catch (error) {
                console.error("Error fetching favorites:", error);
            } finally {
                setLoading(false);
            }
        };

        checkIfFavorite();
    }, [productId]);    

    const handleFavoriteToggle = async () => {
        
        try {
            if (isFavorite) {
                await FavoriteService.removeFromFavorites({ productId, color });
                showToast("Removed from favorites", "info");
            } else {
                await FavoriteService.addToFavorites({ productId, color });
                showToast("Added to favorites", "success");
            }
            setIsFavorite(!isFavorite); // ✅ Toggle state after success
        } catch (error) {
            console.error(error);
            if (error.status === 401) {
                showToast("Please login to add to favorites", "error");
            }
            else
                showToast("Failed to update favorites", "error");
        }
    };

    return { isFavorite, loading, handleFavoriteToggle };
};

export default useProductFavorite;
