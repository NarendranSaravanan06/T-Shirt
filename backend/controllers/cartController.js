const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Offer = require('../models/Offer');
// ✅ Common function to calculate total price
const calculateTotalPrice = async (cart) => {
    const getDiscount = async (productId) => {
        const offer = await Offer.findOne({ productId: productId });
        return offer ? offer.discountPercent : 0;
    };

    const calculateDiscountPrice = async (item) => {
        const discount = await getDiscount(item.productId); // ✅ Await the discount
        return discount> 0 && discount.isActive? item.variant.price - (item.variant.price * discount / 100): item.variant.price ;
    };

    let total = 0;
    for (const item of cart.Products) {
        const price = await calculateDiscountPrice(item);
        total += price * item.variant.quantity;
    }

    return total;
};



const addToCart = async (req, res) => {
    try {
        const { productId, color, size, quantity } = req.body;
        const { userId } = req.user;

        const product = await Product.findOne({ productId });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        const variant = product.variants.find(v => v.color === color);
        if (!variant) return res.status(404).json({ success: false, message: 'Color variant not found' });

        const sizeDetails = variant.sizes.find(s => s.size === size);
        if (!sizeDetails) return res.status(404).json({ success: false, message: 'Size variant not found' });

        if (sizeDetails.quantity < quantity) return res.status(400).json({ success: false, message: 'Not enough quantity available' });

        let cart = await Cart.findOne({ UserId: userId });
        if (!cart) {
            cart = new Cart({
                UserId: userId,
                Products: []
            });
        }

        const existingProductIndex = cart.Products.findIndex(p =>
            p.productId === productId &&
            p.variant.color === color &&
            p.variant.size === size
        );

        let isNewProduct = false;
        if (existingProductIndex !== -1) {
            cart.Products[existingProductIndex].variant.quantity += quantity;
        } else {
            isNewProduct = true;
            cart.Products.push({
                productId,
                variant: {
                    color,
                    size,
                    price: sizeDetails.price,
                    quantity
                }
            });
        }

        await cart.save();

        return res.status(200).json({
            success: true,
            message: isNewProduct ? 'New product added to cart' : 'Cart updated successfully',
            isNewProduct,
            cart
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Reduce or Remove from Cart
const reduceOrRemoveFromCart = async (req, res) => {
    try {
        const { productId, color, size } = req.body;
        console.log(req.body);
        const { userId } = req.user;

        let cart = await Cart.findOne({ UserId: userId });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

        const existingProductIndex = cart.Products.findIndex(p =>
            p.productId === productId &&
            p.variant.color === color &&
            p.variant.size === size
        );

        if (existingProductIndex === -1) {
            return res.status(404).json({ success: false, message: 'Product not found in cart' });
        }

        let existingProduct = cart.Products[existingProductIndex];

        if (existingProduct.variant.quantity > 1) {
            existingProduct.variant.quantity -= 1;
        } else {
            cart.Products.splice(existingProductIndex, 1);
        }

        cart.markModified('Products');

        await cart.save();

        return res.status(200).json({ success: true, message: 'Cart updated', cart });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getCartByUserId = async (req, res) => {
    try {
        const { userId } = req.user;
        const cart = await Cart.findOne({ UserId: userId });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
        const detailedProducts = await Promise.all(
            cart.Products.map(async (cartItem) => {
                const product = await Product.findOne({ productId: cartItem.productId });

                if (!product) {
                    return null; // If product doesn't exist, return null
                }

                // Find matching variant
                const variant = product.variants.find(v => v.color === cartItem.variant.color);
                if (!variant) {
                    return null; // If color variant not found, return null
                }

                const sizeDetails = variant.sizes.find(s => s.size === cartItem.variant.size);
                if (!sizeDetails) {
                    return null; // If size variant not found, return null
                }

                return {
                    productId: cartItem.productId,
                    name: product.name,
                    description: product.description,
                    image: product.image, // Assuming an image field exists
                    variant: {
                        color: cartItem.variant.color,
                        size: cartItem.variant.size,
                        price: sizeDetails.price,
                        quantity: cartItem.variant.quantity
                    }
                };
            })
        );

        // Remove null values (if products were deleted but still in cart)
        const filteredProducts = detailedProducts.filter(item => item !== null);

        return res.status(200).json({
            success: true,
            cart: {
                UserId: cart.UserId,
                Products: filteredProducts,
                total: await calculateTotalPrice(cart)

            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


const getCartTotal = async (req, res) => {
    try {
        const { userId } = req.user;
        const cart = await Cart.findOne({ UserId: userId });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
        return res.status(200).json({
            total: await calculateTotalPrice(cart)
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
module.exports = {
    addToCart,
    reduceOrRemoveFromCart,
    getCartByUserId,
    getCartTotal
};