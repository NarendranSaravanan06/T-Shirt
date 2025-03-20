const express = require('express');
const router = express.Router();
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    findProductsByCategory
} = require('../controllers/productController');
const authMiddleware = require('../middlewares/authorize');
const adminMiddleware = require('../middlewares/admin');

// ✅ Public: Get all products
router.get('/', getProducts);

// ✅ Public: Get product by productId
router.get('/:id', getProductById);

// ✅ Public: Get products by category id
router.get('/category/:categoryId', findProductsByCategory);

// ✅ Admin Only: Create a new product
router.post('/', authMiddleware, adminMiddleware, createProduct);

// ✅ Admin Only: Update a product
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);

// ✅ Admin Only: Delete a product
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;    