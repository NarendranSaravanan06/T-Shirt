const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create a test account using Ethereal for development
let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'your-ethereal-email', // Replace with your Ethereal email
        pass: 'your-ethereal-password' // Replace with your Ethereal password
    }
});

const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

const sendVerificationEmail = async (email, token) => {
    const verificationLink = `http://localhost:3000/verify-email?token=${token}`;

    const mailOptions = {
        from: '"T-Shirt Store" <noreply@tshirtstore.com>',
        to: email,
        subject: 'Email Verification',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2196F3;">Welcome to T-Shirt Store!</h2>
                <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationLink}" 
                       style="background-color: #2196F3; 
                              color: white; 
                              padding: 12px 24px; 
                              text-decoration: none; 
                              border-radius: 4px;
                              display: inline-block;">
                        Verify Email
                    </a>
                </div>
                <p>Or copy and paste this link in your browser:</p>
                <p style="color: #666;">${verificationLink}</p>
                <p>This link will expire in 24 hours.</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">
                    If you didn't create an account, please ignore this email.
                </p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Verification email sent:', info.messageId);
        // For development: Log Ethereal URL to view the email
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
        return true;
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};

const sendPhoneVerificationCode = async (phoneNumber) => {
    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In a real application, you would integrate with an SMS service like Twilio
    // For now, we'll just log the code
    console.log(`Verification code for ${phoneNumber}: ${verificationCode}`);
    
    return verificationCode;
};

module.exports = {
    generateVerificationToken,
    sendVerificationEmail,
    sendPhoneVerificationCode
};
