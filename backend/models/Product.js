const mongoose = require('mongoose');
const Counter = require('./Counter');

const ProductSchema = new mongoose.Schema({
    productId: { type: Number, unique: true }, // ✅ Auto-incremented ID
    productName: { type: String, required: true, trim: true },
    productDescription: { type: String, required: true },
    categoryId: { type: Number, required: true },  // ✅ Category stored as number
    gender: { type: String, enum: ['male', 'female', 'unisex'], default: 'unisex' },

    // ✅ Variants: Each color has its own sizes with independent price & stock
    variants: [
        {
            color: { type: String, required: true },
            sizes: [
                {
                    size: { type: String, required: true },
                    price: { type: Number, required: true, min: 0 },
                    stock: { type: Number, required: true, min: 0 }
                }
            ],
            images: [{ type: String, required: true }] // ✅ Multiple images per color

        }
    ],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// ✅ Auto-increment `productId`
ProductSchema.pre('validate', async function (next) {
    if (!this.productId) {
        const counter = await Counter.findOneAndUpdate(
            { model: 'Product' },
            { $inc: { sequence_value: 1 } },
            { new: true, upsert: true }
        );
        this.productId = counter.sequence_value;
    }
    next();
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;