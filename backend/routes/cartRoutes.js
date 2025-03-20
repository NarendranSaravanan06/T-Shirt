const express = require('express');
const router = express.Router();
const {
   addToCart,reduceOrRemoveFromCart,
   getCartByUserId,
   getCartTotal
} = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authorize');
const adminMiddleware = require('../middlewares/admin');

// ✅ Public: Get all categories
router.post('/add', authMiddleware, addToCart);

router.post('/remove', authMiddleware, reduceOrRemoveFromCart);

router.get('/', authMiddleware, getCartByUserId);
router.get('/total',authMiddleware,getCartTotal)
module.exports = router;