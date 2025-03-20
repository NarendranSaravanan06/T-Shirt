const express = require('express');
const router = express.Router();
const { addAddress } = require('../controllers/addressController');
const authMiddleware = require('../middlewares/authorize');

// Authentication routes
router.post('/add',authMiddleware, addAddress);

module.exports = router;
