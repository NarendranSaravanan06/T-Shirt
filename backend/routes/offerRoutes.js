const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');

// ✅ GET all offers
router.get('/', offerController.getOffers);

// ✅ GET offer by offerId
router.get('/:offerId', offerController.getOfferById);

// ✅ GET all offers for a specific productId
router.get('/product/:productId', offerController.getOffersByProductId);

// ✅ POST - Create a new offer
router.post('/', offerController.createOffer);

// ✅ PUT - Update an offer by productId
router.put('/product/:productId', offerController.updateOfferByProductId);

// ✅ DELETE - Delete an offer by productId
router.delete('/product/:productId', offerController.deleteOfferByProductId);

module.exports = router;
