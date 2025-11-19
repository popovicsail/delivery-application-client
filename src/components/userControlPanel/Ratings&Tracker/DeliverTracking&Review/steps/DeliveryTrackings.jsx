import React, { useEffect, useState } from "react";
import * as RatingService from "../../../../../services/rating.services.jsx";

export default function DeliveryTracking({ onCompleted }) {
  const [status, setStatus] = useState("Loading");
  const orderId = localStorage.getItem("orderId"); // direktno ovde

  const fetchStatus = async () => {
    if (!orderId) {
      console.error("Nema orderId u localStorage!");
      return;
    }
    try {
      const customerOrder = await RatingService.getCustomerOrder(orderId);
      localStorage.setItem("restaurantId", customerOrder.restaurant.id);
      localStorage.setItem("courierId", customerOrder.courierId);
      localStorage.setItem("customerId", customerOrder.customerId);
      console.log("Osvežen status:", customerOrder?.status);
      setStatus(customerOrder?.status ?? "Loading");
    } catch (err) {
      console.error("Greška pri osvežavanju statusa:", err);
    }
  };

  // inicijalno povuci status + short polling svakih 5 sekundi
  useEffect(() => {
    if (!orderId) return;

    fetchStatus(); // odmah povuci status

    const interval = setInterval(() => {
      fetchStatus();
    }, 5000);

    return () => clearInterval(interval); // očisti interval kad se komponenta unmountuje
  }, [orderId]);

  // kad status postane Zavrsena, okini onCompleted
  useEffect(() => {
    if (status === "Zavrsena") {
      onCompleted?.();
    }
  }, [status, onCompleted]);

  return (
    <div className="tracking">
      <h4>📦 Status porudžbine</h4>
      <p>Trenutni status: <strong>{status}</strong></p>
    </div>
  );
}
