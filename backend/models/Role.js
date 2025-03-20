// models/Role.js
const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    userId: { type: Number, required: true, unique: true }, // Use custom sequential userId
    role: {
        type: String, required: true, enum: ['admin', 'user']
    }
});

const Role = mongoose.model('Role', RoleSchema);

module.exports = Role;
