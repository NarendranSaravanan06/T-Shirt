const mongoose = require('mongoose');
const Counter = require('./Counter');

const FavoriteSchema = new mongoose.Schema({
    FavoriteId: { type: Number, unique: true },
    UserId: { type: Number }, 
    Products: [
        {
            productId: { type: Number, required: true },
            color: { type: String, required: true }
        }
    ]
});

// ✅ Auto-increment `FavoriteId`
FavoriteSchema.pre('validate', async function (next) {
    if (!this.FavoriteId) {
        const counter = await Counter.findOneAndUpdate(
            { model: 'Favorite' },
            { $inc: { sequence_value: 1 } },
            { new: true, upsert: true }
        );
        this.FavoriteId = counter.sequence_value;
    }
    next();
});

const Favorite = mongoose.model('Favorite', FavoriteSchema);
module.exports = Favorite;