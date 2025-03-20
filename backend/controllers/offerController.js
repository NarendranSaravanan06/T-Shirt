const Offer = require('../models/Offer'); // Import Offer Model
const Product = require('../models/Product'); // Import Product Model
// ✅ Get all offers
const getOffers = async (req, res) => {
    try {
        const offers = await Offer.find();
        res.status(200).json({ success: true, data: offers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching offers", error: error.message });
    }
};

// ✅ Get offer by offerId
const getOfferById = async (req, res) => {
    try {
        const { offerId } = req.params;
        const offer = await Offer.findOne({ offerId });

        if (!offer && offer.isActive) return res.status(404).json({ success: false, message: "Offer not found" });

        res.status(200).json({ success: true, data: offer });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching offer", error: error.message });
    }
};

// ✅ Get all offers for a specific productId
const getOffersByProductId = async (req, res) => {
    try {
        const { productId } = req.params;
        const offers = await Offer.find({ productId });

        if (offers.length === 0) return res.status(404).json({ success: false, message: "No offers found for this product" });

        res.status(200).json({ success: true, data: offers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching offers", error: error.message });
    }
};

const createOffer = async (req, res) => {
    try {
        const { productId, discountPercent, validFrom, validUntil } = req.body;

        // Validate input
        if (!productId || !discountPercent || !validFrom || !validUntil) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Ensure valid productId exists in the Products DB
        const productExists = await Product.findOne({ productId });
        if (!productExists) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Convert date strings to Date objects
        const parsedValidFrom = new Date(validFrom);
        const parsedValidUntil = new Date(validUntil);

        // Check if dates are valid
        if (isNaN(parsedValidFrom) || isNaN(parsedValidUntil)) {
            return res.status(400).json({ success: false, message: "Invalid date format. Use YYYY-MM-DD." });
        }

        const newOffer = new Offer({
            productId,
            discountPercent,
            validFrom: parsedValidFrom,
            validUntil: parsedValidUntil
        });

        await newOffer.save();

        res.status(201).json({ success: true, message: "Offer created successfully", data: newOffer });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating offer", error: error.message });
    }
};


// ✅ Update an offer by productId
const updateOfferByProductId = async (req, res) => {
    try {
        const { productId } = req.params;
        const updateData = req.body;

        const updatedOffer = await Offer.findOneAndUpdate({ productId }, updateData, { new: true });

        if (!updatedOffer) return res.status(404).json({ success: false, message: "Offer not found" });

        res.status(200).json({ success: true, message: "Offer updated successfully", data: updatedOffer });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating offer", error: error.message });
    }
};

// ✅ Delete an offer by productId
const deleteOfferByProductId = async (req, res) => {
    try {
        const { productId } = req.params;
        const deletedOffer = await Offer.findOneAndDelete({ productId });

        if (!deletedOffer) return res.status(404).json({ success: false, message: "Offer not found" });

        res.status(200).json({ success: true, message: "Offer deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting offer", error: error.message });
    }
};

module.exports = {
    getOffers,
    getOfferById,
    getOffersByProductId,
    createOffer,
    updateOfferByProductId,
    deleteOfferByProductId
};
