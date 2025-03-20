import React, { useEffect, useState } from "react";
import useProductFavorite from "../../hooks/useProductFavorite";
import useProductCart from "../../hooks/useProductCart";
import productService from "../../services/productService";
import discountPercentCalculation from "../../utils/discountPriceCalculation";
const CartItem = ({ item, onRemove }) => {
  const { isFavorite, toggleFavorite, loadingFavorite } = useProductFavorite(item);
  const { isInCart, addToCart, removeFromCart, fetchCartQuantity } = useProductCart(
    item,
    item.variant.color,
    item.variant.size
  );

  const [product, setProduct] = useState(null);
  const [cartQuantity, setCartQuantity] = useState(item.variant.quantity);
  const[price,setPrice]=useState(0);
  useEffect(() => {
    fetchProduct();
  }, [item]);

  useEffect(() => {
    if (isInCart) {
      updateCartQuantity();
    }
  }, [isInCart]);

  useEffect(() => {
    setCartQuantity(item.variant.quantity);
  }, [item]);

  const fetchProduct = async () => {
    try {
      
      const response = await productService.getProductById(item.productId);
      setProduct(response);
      console.log('item',item.variant.price);
      if(response.offerIsActive){
              setPrice(discountPercentCalculation(item.variant.price,response.discountPercent))
      }
      else{
        console.log(item.variant.price);

          setPrice(item.variant.price);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const updateCartQuantity = async () => {
    const quantity = await fetchCartQuantity();
    setCartQuantity(quantity ?? item.variant.quantity);
  };

  const handleIncrease = async () => {
    if (cartQuantity < stockAvailable) {
      await addToCart(1);
      onRemove();
      setCartQuantity((prevQuantity) => prevQuantity + 1);
    } else {
      alert("Cannot add more, stock limit reached!");
    }
  };

  const handleDecrease = async () => {
    if (cartQuantity > 1) {
      await removeFromCart(1);
      setCartQuantity((prevQuantity) => prevQuantity - 1);
      onRemove();
    } else {
      await removeFromCart(1);
      setCartQuantity(0);
      onRemove();
    }
  };

  // Find the correct variant based on color and size
  const selectedVariant = product?.variants?.find(
    (variant) => variant.color === item.variant.color
  )?.sizes.find(
    (sizeObj) => sizeObj.size === item.variant.size
  );

  const productImage = product?.variants?.find(
    (variant) => variant.color === item.variant.color
  )?.images?.[0] || "placeholder.jpg";

  const stockAvailable = selectedVariant?.stock ?? 0;

  return (
    <div className="cart-item">
      {/* Product Image */}
      <div className="cart-item-image">
        <img src={productImage} alt="Product" />
      </div>

      {/* Product Details */}
      <div className="cart-item-details">
        <p><strong>Color:</strong> {item.variant.color}</p>
        <p><strong>Size:</strong> {item.variant.size}</p>
        
        <p><strong>Price:</strong> ₹{price}</p>
        <p><strong>Quantity:</strong> {cartQuantity}</p>
        <p><strong>Stock Available:</strong> {stockAvailable}</p>

        {/* Quantity Controls */}
        <div className="quantity-control">
          <button onClick={handleDecrease} disabled={cartQuantity === 0}>-</button>
          <span>{cartQuantity}</span>
          <button onClick={handleIncrease}>+</button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
