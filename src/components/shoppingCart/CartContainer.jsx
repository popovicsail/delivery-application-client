import React, { useState, useEffect, use } from "react";
import CartView from "./CartView";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import * as userService from "../../services/user.services.jsx";
import { CartProvider } from "./CartContext.jsx";

export default function CartContainer({ customerId, addressId}) {
  const { items, removeFromCart, total, selectedVoucherId, setSelectedVoucherId, clearCart } = useCart();
  const [profile, setProfile] = useState({});
  const [addresses, setAdresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const customer = profile.id;
  const navigate = useNavigate();


  useEffect(() => {
    // Fetch vouchers for the customer
    async function fetchVouchers() {
      try {
        const data = await userService.getMyVouchers(customerId);
        setVouchers(data);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    }

    fetchVouchers();
  }, [customerId]);

useEffect(() => {
  async function fetchAdress() {
    try {
      const data = await userService.getMyAddresses(customerId);
      const dataProfile = await userService.getProfile(customerId);
      setProfile(dataProfile);
      setAdresses(data);
      console.log("Fetched addresses:", data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  }

  fetchAdress();
}, [customerId]);


  const submitOrder = async () => {
    const orderedItems = items.map(i => ({
      dishId: i.originalId || i.id.replace("_", ""),
      quantity: i.quantity,
      dishOptionGroups: i.dishOptionGroups || []
    }));

    const payload = {
      customerId: profile.id,
      addressId: selectedAddressId,
      voucherId: selectedVoucherId || null,
      items: orderedItems,
      restaurantId : orderedItems.length > 0 ? items[0].restaurantId : null
    };

    console.log("Order payload:", payload);

    try {
      const data = await userService.createOderder({...payload
      });
      clearCart();
      navigate("/index");
    } catch (err) {
      console.error(err);
      alert("Nešto nije u redu.");
    }
  };

  return (
    <CartView
      items={items}
      total={total}
      removeFromCart={removeFromCart}
      selectedVoucherId={selectedVoucherId}
      setSelectedVoucherId={setSelectedVoucherId}
      vouchers={vouchers}
      addresses={addresses}
      selectedAddressId={selectedAddressId}
      setSelectedAddressId={setSelectedAddressId}
      onSubmit={submitOrder}
    />
  );
}
