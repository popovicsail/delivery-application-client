import React, { useEffect, useState } from "react";
import * as RatingService from "../../../../../services/rating.services.jsx";

export default function DeliveryTracking({ onCompleted }) {
  const [status, setStatus] = useState("Loading");
  const [eta, setEta] = useState(null);
  const [items, setItems] = useState([]);
  const orderId = localStorage.getItem("orderId"); // ostaje samo za orderId

  const statusLabels = {
    Draft: "Draft",
    NaCekanju: "Na čekanju",
    Prihvacena: "Prihvaćena",
    Odbijena: "Odbijena",
    CekaSePreuzimanje: "Čeka se preuzimanje",
    Preuzeto: "Preuzeto",
    DostavaUToku: "Dostava u toku",
    Zavrsena: "Završena",
    Loading: "Učitavanje...",
  };

  const formatTime24h = (value) => {
    if (!value) return null;
    return new Intl.DateTimeFormat("sr-RS", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Belgrade",
    }).format(value);
  };

  const fetchStatus = async () => {
    if (!orderId) {
      console.error("Nema orderId u localStorage!");
      return;
    }
    try {
      const customerOrder = await RatingService.getCustomerOrder(orderId);

      // ostali ID‑evi i dalje se čuvaju u localStorage
      localStorage.setItem("restaurantId", customerOrder.restaurant.id);
      localStorage.setItem("courierId", customerOrder.courierId);
      localStorage.setItem("customerId", customerOrder.customerId);

      const newStatus = customerOrder?.status ?? "Loading";
      setStatus(newStatus);
      setItems(customerOrder?.items ?? []);

      // Reset u NaCekanju ili Zavrsena
      if (newStatus === "NaCekanju" || newStatus === "Zavrsena") {
        setEta(null);
      } else if (customerOrder?.createdAt && customerOrder?.timeToPrepare) {
        // Uvek računaj ETA na osnovu CreatedAt + timeToPrepare
        const createdAt = new Date(customerOrder.createdAt);
        const etaCalc = new Date(
          createdAt.getTime() + customerOrder.timeToPrepare * 60000
        );
        setEta(etaCalc);
      }

      console.log("Osvežen status:", newStatus);
    } catch (err) {
      console.error("Greška pri osvežavanju statusa:", err);
    }
  };

  useEffect(() => {
    if (!orderId) return;

    fetchStatus();

    const interval = setInterval(() => {
      fetchStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

  useEffect(() => {
    if (status === "Zavrsena") {
      onCompleted?.();
    }
  }, [status, onCompleted]);

  return (
    <div className="tracking">
      <h4>📦 Status porudžbine</h4>
      <p>
        Trenutni status: <strong>{statusLabels[status] ?? status}</strong>
        {status === "NaCekanju" && " ⏳"}
        {status === "Prihvacena" && " ✅"}
        {status === "Odbijena" && " ❌"}
        {status === "CekaSePreuzimanje" && " 📦"}
        {status === "Preuzeto" && " 🛵"}
        {status === "DostavaUToku" && " 🚚"}
        {status === "Zavrsena" && " 🎉"}
      </p>

      {status !== "NaCekanju" && eta && (
        <p>
          Procena dostave: <strong>{formatTime24h(eta)} ⏰</strong>
        </p>
      )}

      {items.length > 0 && (
        <div className="order-items">
          <h5>🍽️ Artikli u porudžbini:</h5>
          <ul>
            {items.map((item, idx) => (
              <li key={idx}>
                {item.name} × {item.quantity} — {item.price} RSD
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
