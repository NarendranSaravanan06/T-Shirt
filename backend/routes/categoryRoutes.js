const express = require('express');
const router = express.Router();
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authorize');
const adminMiddleware = require('../middlewares/admin');

// ✅ Public: Get all categories
router.get('/', getAllCategories);

// ✅ Public: Get a single category by categoryId
router.get('/:id', getCategoryById);

// ✅ Admin Only: Create a new category
router.post('/', authMiddleware, adminMiddleware, createCategory);

// ✅ Admin Only: Update a category by categoryId
router.put('/:id', authMiddleware, adminMiddleware, updateCategory);

// ✅ Admin Only: Delete a category by categoryId
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;