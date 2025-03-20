const cron = require('node-cron');
const mongoose = require('mongoose');
const Offer = require('../models/Offer'); // Ensure correct path

// Function to deactivate expired offers
const deactivateExpiredOffers = async () => {
    try {
        const now = new Date();
        const result = await Offer.updateMany(
            { validUntil: { $lt: now }, isActive: true }, // Expired but still active
            { $set: { isActive: false } } // Deactivate them
        );
        console.log(`✅ Deactivated ${result.modifiedCount} expired offers.`);
    } catch (error) {
        console.error('❌ Error deactivating expired offers:', error);
    }
};

// Schedule the cron job to run every midnight (00:00)
cron.schedule('0 0 * * *', async () => {
    console.log('🕛 Running expired offers cleanup task...');
    await deactivateExpiredOffers();
});

// Export function for manual execution if needed
module.exports = deactivateExpiredOffers;
