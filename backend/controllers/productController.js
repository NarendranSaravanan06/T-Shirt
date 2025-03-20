const Product = require('../models/Product');
const Category = require('../models/Category');
const Counter = require('../models/Counter'); // ✅ Required for productId auto-increment
const CustomError = require('../middlewares/customError');

// ✅ Helper function to get the next productId
const getNextProductId = async () => {
    const counter = await Counter.findOneAndUpdate(
        { model: 'Product' },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );
    return counter.sequence_value;
};

// ✅ Create a new product (Admin Only)
const createProduct = async (req, res, next) => {
    try {
        const data = req.body;
        console.log(req.body);
        const products = Array.isArray(data) ? data : [data];

        for (const productData of products) {
            const { categoryId } = productData;

            if (!categoryId) {
                return next(new CustomError('categoryId is required', 400));
            }

            const numericCategoryId = Number(categoryId);
            if (isNaN(numericCategoryId)) {
                return next(new CustomError('Invalid categoryId', 400));
            }

            const category = await Category.findOne({ categoryId: numericCategoryId });
            if (!category) {
                return next(new CustomError(`Category with ID ${categoryId} not found`, 404));
            }
        }

        // ✅ Handle bulk product creation with auto-incremented `productId`
        if (Array.isArray(data)) {
            const productPromises = products.map(async (product) => ({
                ...product,
                categoryId: Number(product.categoryId),
                productId: await getNextProductId()
            }));

            const preparedProducts = await Promise.all(productPromises);
            const savedProducts = await Product.insertMany(preparedProducts);

            return res.status(201).json({ message: "Products created successfully", products: savedProducts });
        }

        // ✅ Handle single product creation with auto-incremented `productId`
        const product = new Product({
            ...data,
            categoryId: Number(data.categoryId),
            productId: await getNextProductId()
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

// ✅ Get all products with category details
const getProducts = async (req, res, next) => {
    try {
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "categoryId",
                    as: "category"
                }
            },
            { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "offers",
                    localField: "productId",
                    foreignField: "productId",
                    as: "offer"
                }
            },
            { $unwind: { path: "$offer", preserveNullAndEmptyArrays: true } }, // Handle cases where no offer exists
            {
                $project: {
                    _id: 0,
                    productId: 1,
                    productName: 1,
                    productDescription: 1,
                    categoryName: "$category.categoryName",
                    gender: 1,
                    variants: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    price: 1,
                    offerIsActive: { $ifNull: ["$offer.isActive", false] },
                    discountPercent: { $ifNull: ["$offer.discountPercent", 0] },
                    discountedPrice: {
                        $round: [{ $multiply: ["$price", { $subtract: [1, { $divide: ["$offer.discountPercent", 100] }] }] }, 2]
                    }
                }
            }
        ]);

        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const productId = Number(req.params.id);

        const product = await Product.aggregate([
            { $match: { productId } },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "categoryId",
                    as: "category"
                }
            },
            { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "offers",
                    localField: "productId",
                    foreignField: "productId",
                    as: "offer"
                }
            },
            { $unwind: { path: "$offer", preserveNullAndEmptyArrays: true } }, // Handle cases where no offer exists
            {
                $project: {
                    _id: 0,
                    productId: 1,
                    productName: 1,
                    productDescription: 1,
                    categoryName: "$category.categoryName",
                    gender: 1,
                    variants: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    price: 1,
                    offerIsActive: { $ifNull: ["$offer.isActive", false] },
                    discountPercent: { $ifNull: ["$offer.discountPercent", 0] },
                    
                }
            }
        ]);

        if (!product.length) return next(new CustomError('Product not found', 404));

        res.status(200).json(product[0]);
    } catch (error) {
        next(error);
    }
};

// ✅ Update a product (Admin Only)
const updateProduct = async (req, res, next) => {
    try {
        const { productName, productDescription, gender, categoryId, variants } = req.body;

        // Validate category existence if updating categoryId
        if (categoryId) {
            const category = await Category.findOne({ categoryId: Number(categoryId) });
            if (!category) return next(new CustomError('Category not found', 404));
        }

        // ✅ Update product by `productId`
        const product = await Product.findOneAndUpdate(
            { productId: Number(req.params.id) },
            { productName, productDescription, gender, categoryId, variants, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!product) return next(new CustomError('Product not found', 404));

        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

// ✅ Delete a product (Admin Only)
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findOneAndDelete({ productId: Number(req.params.id) });

        if (!product) return next(new CustomError('Product not found', 404));

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// ✅ Find Products by Category
const findProductsByCategory = async (req, res, next) => {
    try {
        const category = await Category.findOne({ categoryId: req.params.categoryId });

        if (!category) {
            return next(new CustomError('Category not found', 404));
        }

        const products = await Product.find({ categoryId: category.categoryId })
            .select('-_id productId productName productDescription gender variants categoryId');

        if (products.length === 0) {
            return res.status(200).json({ message: "No products found in this category" });
        }

        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    findProductsByCategory,
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};