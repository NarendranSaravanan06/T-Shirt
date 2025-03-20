const mongoose = require('mongoose');
const Counter = require('./Counter');

const CategorySchema = new mongoose.Schema({
    categoryId: { type: Number, unique: true },
    categoryName: { type: String, required: true, unique: true },
    categoryDescription: { type: String }
});

// Auto-increment categoryId
CategorySchema.pre('save', async function (next) {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { model: 'Category' },
            { $inc: { sequence_value: 1 } },
            { new: true, upsert: true }
        );
        this.categoryId = counter.sequence_value;
    }
    next();
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;