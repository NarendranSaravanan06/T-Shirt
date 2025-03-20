const Favorite = require('../models/Favorite'); 
const Product = require('../models/Product');

// ✅ Add to Favorites
const addToFavorites = async (req, res) => {
    try {
        const { productId, color } = req.body;
        const { userId } = req.user;
        const productColor= await Product.findOne({"variants.color":color});
        if (!productColor) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        let favorite = await Favorite.findOne({ UserId: userId });

        if (!favorite) {
            favorite = await Favorite.create({
                UserId: userId,
                Products: [],
            });
        }

        // Check if this exact variant is already in favorites
        const exists = favorite.Products.some(p => 
            p.productId === productId && p.color === color
        );

        if (exists) {
            return res.status(400).json({ success: false, message: 'Variant already in favorites' });
        }

        // ✅ Add specific variant to favorites
        favorite.Products.push({ productId, color });
        await favorite.save();

        return res.status(200).json({ success: true, message: 'Variant added to favorites', favorite });
    } catch (error) {
        console.error("Error adding to favorites:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ✅ Remove from Favorites
const removeFromFavorites = async (req, res) => {
    try {
        const { userId } = req.user;
        const { productId, color } = req.body;

        const favorite = await Favorite.findOne({ UserId: userId });

        if (!favorite) {
            return res.status(404).json({ success: false, message: "Favorite list not found" });
        }

        // Remove only the selected variant
        const updatedFavorites = await Favorite.findOneAndUpdate(
            { UserId: userId },
            { $pull: { Products: { productId: productId, color: color } } },
            { new: true }
        );

        if (!updatedFavorites) {
            return res.status(404).json({ success: false, message: "Variant not found in favorites" });
        }

        return res.status(200).json({ success: true, message: "Variant removed from favorites", favorite: updatedFavorites });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};



const getFavByUserId = async (req, res) => {
    try {
        let { userId } = req.user;

        const favorite = await Favorite.findOne({ UserId: userId });
        if (!favorite) return res.status(404).json({ success: false, message: 'Favorites not found' });

        return res.status(200).json({ success: true, products: favorite.Products });
      
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addToFavorites,
    removeFromFavorites,
    getFavByUserId
};
