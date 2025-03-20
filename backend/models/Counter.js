const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
    model: { type: String, required: true, unique: true },
    sequence_value: { type: Number, default: 1 }
});

const Counter = mongoose.model('Counter', CounterSchema);

module.exports = Counter;
