import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);

  const addToCart = (dish,) => {
    const exists = items.some(i => i.originalId === dish.id);
    if (exists) return;

    const newItem = {
      ...dish,
      id: dish.id + "_",
      originalId: dish.id,
      quantity: dish.quantity || 1,
      dishOptionGroups: [],
      isOrdered: true,
      restaurantId: dish.restaurantId
    };

    setItems(prev => [...prev, newItem]);
    console.log("Dodavanje u korpu:", dish); // Proverite vrednosti dish.quantity
  // Logika za dodavanje u korpu
  };

  const updateItem = (dishId, updatedData) => {
    setItems(prev =>
      prev.map(item =>
        item.originalId === dishId || item.id === dishId
          ? { ...item, ...updatedData }
          : item
      )
    );
  };

  const updateGroups = (dishId, groupId, option, checked, groupType) => {
    setItems(prev =>
      prev.map(item => {
        if (item.originalId !== dishId && item.id !== dishId) return item;

        const groupExists = item.dishOptionGroups.some(g => g.id === groupId);
        let updatedGroups;

        if (groupExists) {
          updatedGroups = item.dishOptionGroups.map(group => {
            if (group.id !== groupId) return group;

            if (groupType === "choice") {
              return {
                ...group,
                dishOptions: [{ id: option.id, price: option.price }]
              };
            }

            if (checked) {
              if (!group.dishOptions.some(opt => opt.id === option.id)) {
                return {
                  ...group,
                  dishOptions: [...group.dishOptions, { id: option.id, price: option.price }]
                };
              }
              return group;
            } else {
              return {
                ...group,
                dishOptions: group.dishOptions.filter(opt => opt.id !== option.id)
              };
            }
          });
        } else {
          updatedGroups = [
            ...item.dishOptionGroups,
            {
              id: groupId,
              type: groupType,
              dishOptions: checked ? [{ id: option.id, price: option.price }] : []
            }
          ];
        }

        return {
          ...item,
          dishOptionGroups: updatedGroups
        };
      })
    );
  };

  const removeFromCart = (dishId) => {
    setItems(prev => prev.filter(i => i.id !== dishId && i.originalId !== dishId));
  };

  const clearCart = () => {
    setItems([]);
    setSelectedVoucherId(null);
  };

  const total = items.reduce((sum, i) => {
    const base = i.price * (Number(i.quantity) || 1);
    const extras = i.dishOptionGroups?.flatMap(g => g.dishOptions)?.reduce((s, o) => s + o.price, 0) || 0;
    return sum + base + extras;
  }, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      updateItem,
      updateGroups,
      removeFromCart,
      clearCart,
      total,
      selectedVoucherId,
      setSelectedVoucherId
    }}>
      {children}
    </CartContext.Provider>
  );
}
