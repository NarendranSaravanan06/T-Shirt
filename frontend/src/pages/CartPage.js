import React, { useEffect, useState } from "react";
import cartService from "../services/cartService";
import { useAuth } from "../contexts/AuthContext";
import CartItem from "../components/reusables/CartItem";
import "../styles/CartPage.css";

function CartPage() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userId) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      if (!user?.userId) return;

      const response = await cartService.getCartById(user.userId);

      if (response?.success && response.cart) {
        setCartItems(response.cart.Products || []);
        setTotal(response.cart.total || 0);
      } else {
        console.error("Cart data is missing or incorrect:", response);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
    fetchCart(); // Refresh the cart after removing an item
  };

  return (
    <div className="cart-main">
      <h2>Your Cart</h2>
      {loading ? (
        <p>Loading cart...</p>
      ) : cartItems.length > 0 ? (
        <div>

          {cartItems.map((item) => (<>
            <CartItem key={item.productId} item={item} onRemove={handleRemoveItem} />
          </>

          ))}
          <h3>Total: ₹{total}</h3>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
      <button className="cart-btn" disabled={cartItems.length === 0}>Checkout</button>
    </div>
  );
}

export default CartPage;
