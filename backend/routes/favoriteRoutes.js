const express = require('express');
const router = express.Router();
const { addToFavorites, removeFromFavorites, getFavByUserId } = require('../controllers/favoriteController');
const authMiddleware = require('../middlewares/authorize');

router.post('/add',authMiddleware, addToFavorites);
router.post('/remove',authMiddleware, removeFromFavorites);
router.get('/',authMiddleware,getFavByUserId)
module.exports = router;
