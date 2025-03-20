const mongoose = require('mongoose');
const Counter = require('./Counter');

const CartSchema = new mongoose.Schema({
    CartId: { type: Number, unique: true },
    UserId: { type: Number, unique: true, required: true }, // Unique cart per user
    Products: [
        {
            productId: { type: Number, required: true },
            variant: {
                color: { type: String, required: true },
                size: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true } // Acts as quantity in cart
            }
        }
    ]
});

// ✅ Auto-increment `CartId`
CartSchema.pre('validate', async function (next) {
    if (!this.CartId) {
        const counter = await Counter.findOneAndUpdate(
            { model: 'Cart' },
            { $inc: { sequence_value: 1 } },
            { new: true, upsert: true }
        );
        this.CartId = counter.sequence_value;
    }
    next();
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;