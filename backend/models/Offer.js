const mongoose = require('mongoose');
const Counter = require('./Counter');

const OfferSchema = new mongoose.Schema({
    offerId: { type: Number, unique: true },
    productId: { type: Number, required: true, index: true }, // Index added
    discountPercent: { type: Number, required: true, min: 1, max: 100 },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    isActive: { type: Boolean, default: true }
});

// Ensure validUntil is greater than validFrom
OfferSchema.pre('validate', function (next) {
    if (this.validUntil <= this.validFrom) {
        return next(new Error("'validUntil' must be greater than 'validFrom'"));
    }
    next();
});

// Auto-increment offerId using Counter model
OfferSchema.pre('validate', async function (next) {
    if (!this.offerId) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { model: 'Offer' },
                { $inc: { sequence_value: 1 } },
                { new: true, upsert: true }
            );
            this.offerId = counter.sequence_value;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const Offer = mongoose.model('Offer', OfferSchema);
module.exports = Offer;
