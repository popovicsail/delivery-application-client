import React, { useEffect, useState } from "react";
import * as RatingService from "../../../../../services/rating.services.jsx";

export default function DeliveryTracking({ order, onCompleted, refreshKey }) {
  const [status, setStatus] = useState("Loading");

  // helper za osvežavanje statusa
  const fetchStatus = async () => {
    if (!order) return;
    try {
      const customerOrder = await RatingService.getCustomerOrder(order.id);
      setStatus(customerOrder?.status ?? "Loading");
    } catch (err) {
      console.error("Greška pri dobavljanju statusa:", err);
    }
  };

  // inicijalno postavi status kad order stigne
  useEffect(() => {
    if (order?.status) {
      setStatus(order.status);
    } else {
      setStatus("Loading");
    }
  }, [order?.status]);

  // polling svakih 5 sekundi
  useEffect(() => {
    if (!order) return;

    // odmah povuci status kad se mountuje
    fetchStatus();

    const interval = setInterval(() => {
      fetchStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, [order?.id]);

  // ručni refresh preko refreshKey
  useEffect(() => {
    if (!order) return;
    fetchStatus();
  }, [refreshKey, order?.id]);

  // kad status postane Zavrsena, okini onCompleted
  useEffect(() => {
    if (status === "Zavrsena") {
      onCompleted?.();
    }
  }, [status, onCompleted]);

  if (!order) {
    return <p>⏳ Učitavam porudžbinu...</p>;
  }

  return (
    <div className="tracking">
      <h4>📦 Status porudžbine</h4>
      <p>
        Trenutni status: <strong>{status}</strong>
      </p>
    </div>
  );
}
