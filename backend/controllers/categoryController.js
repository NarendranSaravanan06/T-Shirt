const Category = require('../models/Category');
const CustomError = require('../middlewares/customError');

// ✅ Create a new category (Admin Only)
const createCategory = async (req, res, next) => {
    try {
        const { categoryName, categoryDescription } = req.body;

        // Check if category already exists
        const existingCategory = await Category.findOne({ categoryName });
        if (existingCategory) {
            return next(new CustomError('Category already exists!', 400));
        }

        const category = new Category({ categoryName, categoryDescription });
        await category.save();

        res.status(201).json(category);
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};

// ✅ Get all categories
const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().select('-_id categoryId categoryName categoryDescription');
        res.status(200).json(categories);
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};

// ✅ Get a single category by categoryId
const getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findOne({ categoryId: req.params.id }).select('-_id categoryName categoryDescription');
        if (!category) {
            return next(new CustomError('Category not found!', 404));
        }
        res.status(200).json(category);
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};

// ✅ Update a category (Admin Only)
const updateCategory = async (req, res, next) => {
    try {
        const { categoryName, categoryDescription } = req.body;
        const category = await Category.findOneAndUpdate(
            { categoryId: req.params.id },  // Find by categoryId instead of _id
            { categoryName, categoryDescription },
            { new: true, runValidators: true }
        );

        if (!category) {
            return next(new CustomError('Category not found!', 404));
        }

        res.status(200).json(category);
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};

// ✅ Delete a category (Admin Only)
const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findOneAndDelete({ categoryId: req.params.id });
        if (!category) {
            return next(new CustomError('Category not found!', 404));
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};