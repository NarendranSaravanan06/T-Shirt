const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const database = require("./utils/database");

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const addressRoutes = require('./routes/addressRoutes');
const roleRoutes = require('./routes/roleRoutes');
const offerRoutes = require('./routes/offerRoutes');
// Connect Database & Start Server
const start = async () => {
    try {
        await database();
        console.log('✅ MongoDB Connected');

        // Run Offer Cleanup After DB is Connected
        const deactivateExpiredOffers = require("./utils/offerScheduler");
        await deactivateExpiredOffers(); // Run once on startup

        // Start Server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('❌ Server Startup Error:', error);
    }
};

// Attach Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/product', productRoutes);
app.use('/cart', cartRoutes);
app.use('/favorite', favoriteRoutes);
app.use('/address', addressRoutes);
app.use('/role', roleRoutes);
app.use('/offer', offerRoutes);
start();