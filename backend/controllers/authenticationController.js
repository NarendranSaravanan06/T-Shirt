// controllers/authController.js
const User = require('../models/User');
const Role = require('../models/Role');
const Counter = require('../models/Counter');
const CustomError = require('../middlewares/customError');
const generateToken = require('../utils/token');
const { hashPassword, comparePassword } = require('../utils/password');

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new CustomError('Email and password are required', 400));
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new CustomError('Invalid email!!!', 401));
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return next(new CustomError('Invalid password...retry!!', 401));
        }

        const role = await Role.findOne({ userId: user.userId });
        if (!role) {
            return next(new CustomError('Role not found for this user!', 404));
        }

        // Create a user object without the password
        const userResponse = {
            userId: user.userId,
            email: user.email,
            name: user.name,
            role: role.role
        };

        const token = generateToken(userResponse);
        res.status(200).json({
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        next(new CustomError(error.message, 500));
    }
};

const getNextSequenceValue = async (model) => {
    try {
        const counter = await Counter.findOneAndUpdate(
            { model },
            { $inc: { sequence_value: 1 } },
            { new: true, upsert: true }
        );
        return counter.sequence_value;
    } catch (error) {
        throw new Error('Failed to generate unique ID');
    }
};

const register = async (req, res, next) => {
    try {
        const { name, email, password, phoneNumber, role = 'user' } = req.body;
        console.log(req.body)
        // Input validation
        if (!name?.trim() || !email?.trim() || !password || !phoneNumber?.trim()) {
            return next(new CustomError('All fields are required', 400));
        }

        // Check for existing user or phone number
        const [existingUser, existingPhone] = await Promise.all([
            User.findOne({ email: email.trim().toLowerCase() }),
            User.findOne({ phoneNumber: phoneNumber.trim() })
        ]);

        if (existingUser) {
            return next(new CustomError('User already exists with this email', 400));
        }

        if (existingPhone) {
            return next(new CustomError('Phone number already registered', 400));
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Get the next userId
        const userId = await getNextSequenceValue('User');

        // Prepare user data
        const userData = {
            userId,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            phoneNumber: phoneNumber.trim()
        };

        // Create user
        const user = await User.create(userData);

        // Create role
        const roleData = {
            userId: user.userId,
            role: role,
        };

        try {
            const userRole = await Role.create(roleData);

            // Generate token
            user.role = userRole.role;
            const token = generateToken(user);

            // Send response
            res.status(201).json({
                user: {
                    userId: user.userId,
                    name: user.name,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    role: userRole.role
                },
                token
            });
        } catch (roleError) {
            // If role creation fails, delete the user
            await User.findByIdAndDelete(user._id);
            throw new Error('Failed to create user role');
        }
    } catch (error) {
        console.error('Registration error:', error);

        if (error instanceof CustomError) {
            return next(error);
        }

        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return next(new CustomError(`${field} already exists`, 400));
        }

        next(new CustomError(error.message || 'Internal Server Error', 500));
    }
};

module.exports = { login, register };