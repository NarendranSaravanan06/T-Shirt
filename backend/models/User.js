const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    userId: { type: Number, unique: true, required: true },
    name: { 
        type: String, 
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long']
    },
    password: { 
        type: String, 
        required: [true, 'Password is required']
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        unique: true, 
        lowercase: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please enter a valid email address'
        }
    },
    phoneNumber: { 
        type: String, 
        maxLength: [10, 'Phone number cannot be more than 10 digits'],
        minLength: [10, 'Phone number must be 10 digits'],
        unique: true,
        required: [true, 'Phone number is required'],
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: 'Please enter a valid 10-digit phone number'
        }
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    phoneVerificationCode: String,
    phoneVerificationExpires: Date
}, {
    timestamps: true
});

const User = mongoose.model('User', UserSchema);

module.exports = User;