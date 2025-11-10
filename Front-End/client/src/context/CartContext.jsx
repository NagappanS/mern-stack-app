import { createContext, useState, useEffect } from "react";
import API from "../api/API";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ restaurantId: null, items: [] });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/me");
        setUserId(res.data._id);
        // console.log("Fetched user ID:", res.data._id);
      } catch (err) {
        console.error("Failed to fetch user", err);
        setUserId(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const getCartKey = () => `cart_${userId || "guest"}`;

  const persist = (next) => {
    setCart(next);
    if (userId) localStorage.setItem(getCartKey(), JSON.stringify(next));
  };

  // Load cart whenever userId changes
  useEffect(() => {
    if (loading) return; // Wait until user is fetched

    if (!userId) {
      // If user logs out, clear cart immediately
      setCart({ restaurantId: null, items: [] });
      return;
    }

    const key = getCartKey();
    try {
      const saved = JSON.parse(localStorage.getItem(key)) || { restaurantId: null, items: [] };
      setCart(saved);
    } catch {
      setCart({ restaurantId: null, items: [] });
    }
  }, [userId, loading]);

  // 🧹 When user logs out, remove their cart from memory
  useEffect(() => {
    if (!userId && !loading) {
      setCart({ restaurantId: null, items: [] });
    }
  }, [userId, loading]);

  const addToCart = (food, quantity = 1) => {
    if (!cart.restaurantId || cart.restaurantId === food.restaurant) {
      const existing = cart.items.find((i) => i.foodId === food._id);
      const newItems = existing
        ? cart.items.map((i) =>
            i.foodId === food._id ? { ...i, quantity: i.quantity + quantity } : i
          )
        : [
            ...cart.items,
            {
              foodId: food._id,
              _id: food._id,
              name: food.name,
              price: food.price,
              image: food.image,
              quantity,
              restaurant: food.restaurant,
            },
          ];

      persist({ restaurantId: food.restaurant, items: newItems });
      return { success: true };
    } else {
      return { success: false, message: "Cart has items from another restaurant" };
    }
  };

  const updateQuantity = (foodId, qty) => {
    const newItems = cart.items.map((i) =>
      i.foodId === foodId ? { ...i, quantity: qty } : i
    );
    persist({ ...cart, items: newItems });
  };

  const removeFromCart = (foodId) => {
    const newItems = cart.items.filter((i) => i.foodId !== foodId);
    persist({
      restaurantId: newItems.length ? cart.restaurantId : null,
      items: newItems,
    });
  };

  const clearCart = () => persist({ restaurantId: null, items: [] });

  const getTotal = () =>
    cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (loading) return null; // Wait until userId is fetched

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
