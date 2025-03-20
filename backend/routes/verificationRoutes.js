const express = require('express');
const router = express.Router();
const User = require('../models/User');
const CustomError = require('../middlewares/customError');
const { generateVerificationToken, sendVerificationEmail, sendPhoneVerificationCode } = require('../utils/emailService');

// Resend verification email
router.post('/resend-email-verification', async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return next(new CustomError('User not found', 404));
        }

        if (user.isEmailVerified) {
            return next(new CustomError('Email is already verified', 400));
        }

        const token = generateVerificationToken();
        user.emailVerificationToken = token;
        user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        await user.save();

        await sendVerificationEmail(email, token);

        res.status(200).json({
            message: 'Verification email sent successfully'
        });
    } catch (error) {
        next(error);
    }
});

// Verify email
router.get('/verify-email', async (req, res, next) => {
    try {
        const { token } = req.query;

        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return next(new CustomError('Invalid or expired verification token', 400));
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        res.status(200).json({
            message: 'Email verified successfully'
        });
    } catch (error) {
        next(error);
    }
});

// Send phone verification code
router.post('/send-phone-verification', async (req, res, next) => {
    try {
        const { phoneNumber } = req.body;
        const user = await User.findOne({ phoneNumber });

        if (!user) {
            return next(new CustomError('User not found', 404));
        }

        if (user.isPhoneVerified) {
            return next(new CustomError('Phone number is already verified', 400));
        }

        const verificationCode = await sendPhoneVerificationCode(phoneNumber);
        user.phoneVerificationCode = verificationCode;
        user.phoneVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();

        res.status(200).json({
            message: 'Verification code sent successfully'
        });
    } catch (error) {
        next(error);
    }
});

// Verify phone number
router.post('/verify-phone', async (req, res, next) => {
    try {
        const { phoneNumber, code } = req.body;
        const user = await User.findOne({
            phoneNumber,
            phoneVerificationCode: code,
            phoneVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return next(new CustomError('Invalid or expired verification code', 400));
        }

        user.isPhoneVerified = true;
        user.phoneVerificationCode = undefined;
        user.phoneVerificationExpires = undefined;
        await user.save();

        res.status(200).json({
            message: 'Phone number verified successfully'
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
