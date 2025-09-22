// src/context/CartContext.jsx
import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // shape: { restaurantId: string|null, items: [{ foodId, _id, name, price, image, quantity, restaurant }] }
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || { restaurantId: null, items: [] };
    } catch {
      return { restaurantId: null, items: [] };
    }
  });

  const persist = (next) => {
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  const addToCart = (food, quantity = 1) => {
    // food must include: _id, name, price, image, restaurant (id)
    if (!cart.restaurantId || cart.restaurantId === food.restaurant) {
      // same restaurant or empty cart
      const existing = cart.items.find((i) => i.foodId === food._id);
      let newItems;
      if (existing) {
        newItems = cart.items.map((i) =>
          i.foodId === food._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        newItems = [
          ...cart.items,
          {
            foodId: food._id,
            _id: food._id,
            name: food.name,
            price: food.price,
            image: food.image,
            quantity,
            restaurant: food.restaurant
          }
        ];
      }
      persist({ restaurantId: food.restaurant, items: newItems });
      return { success: true };
    } else {
      // different restaurant — return false so UI can prompt user
      return { success: false, message: "Cart has items from another restaurant" };
    }
  };

  const updateQuantity = (foodId, qty) => {
    const newItems = cart.items.map((i) => i.foodId === foodId ? { ...i, quantity: qty } : i);
    persist({ ...cart, items: newItems });
  };

  const removeFromCart = (foodId) => {
    const newItems = cart.items.filter((i) => i.foodId !== foodId);
    const restaurantId = newItems.length ? cart.restaurantId : null;
    persist({ restaurantId, items: newItems });
  };

  const clearCart = () => persist({ restaurantId: null, items: [] });

  const getTotal = () => cart.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
};
