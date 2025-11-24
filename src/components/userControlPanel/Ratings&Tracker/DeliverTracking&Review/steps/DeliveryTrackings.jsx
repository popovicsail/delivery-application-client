import React, { useEffect, useState } from "react";
import * as RatingService from "../../../../../services/rating.services.jsx";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as signalR from "@microsoft/signalr";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// ✅ Podesi default marker ikone
L.Icon.Default.mergeOptions({
  shadowUrl: markerShadow,
});

export default function DeliveryTracking({ onCompleted }) {
  const [status, setStatus] = useState("Loading");
  const [eta, setEta] = useState(null);
  const [items, setItems] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [courierLocation, setCourierLocation] = useState(null);
  const [customerOrder, setCustomerOrder] = useState(null);

  const orderId = localStorage.getItem("orderId");
  const [connection, setConnection] = useState(null);

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
    if (!orderId) return;
    try {
      const customerOrder = await RatingService.getCustomerOrder(orderId);
      setCustomerOrder(customerOrder);

      if (customerOrder?.restaurant?.id) {
        localStorage.setItem("restaurantId", customerOrder.restaurant.id);
      }
      if (customerOrder?.courierId) {
        localStorage.setItem("courierId", customerOrder.courierId);
      }
      if (customerOrder?.customerId) {
        localStorage.setItem("customerId", customerOrder.customerId);
      }

      const newStatus = customerOrder?.status ?? "Loading";
      setStatus(newStatus);
      setItems(customerOrder?.items ?? []);

      // ETA
      if (newStatus === "NaCekanju" || newStatus === "Zavrsena") {
        setEta(null);
      } else if (customerOrder?.createdAt && customerOrder?.timeToPrepare) {
        const createdAt = new Date(customerOrder.createdAt);
        const etaCalc = new Date(
          createdAt.getTime() + customerOrder.timeToPrepare * 60000
        );
        setEta(etaCalc);
      }

      // Ako backend vraća poslednju lokaciju
      if (customerOrder?.courierLocation) {
        setCourierLocation(customerOrder.courierLocation);
      }
    } catch (err) {
      console.error("Greška pri osvežavanju statusa:", err);
    }
  };

  // 1️⃣ Polling statusa (svakih 5 sekundi)
  useEffect(() => {
    if (!orderId) return;
    fetchStatus();
    const interval = setInterval(() => fetchStatus(), 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  // 2️⃣ SignalR konekcija za real-time lokaciju
  useEffect(() => {
    if (!orderId) return;

    const conn = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:5000/hubs/courierLocation", {
        transport: signalR.HttpTransportType.WebSockets,
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    conn.on("ReceiveLocation", (location) => {
      try {
        console.log("📍 Nova lokacija primljena:", location);
        setCourierLocation({ lat: location.lat, lng: location.lng });
      } catch (err) {
        console.error("❌ Greška pri obradi lokacije:", err);
      }
    });

    const startConnection = async () => {
      try {
        console.log("Pokušavam da povežem SignalR...");
        await conn.start();
        console.log("✅ SignalR connected");
        await conn.invoke("JoinOrder", orderId);
        console.log("✅ JoinOrder poslat za", orderId);
      } catch (err) {
        console.error("❌ Greška pri startovanju SignalR konekcije:", err);
      }
    };

    startConnection();
    setConnection(conn);

    return () => {
      conn.stop().catch((err) => {
        console.error("❌ Greška pri zatvaranju konekcije:", err);
      });
    };
  }, [orderId]);

  // 3️⃣ Ako je porudžbina završena
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
                {item.name} × {item.quantity} — {customerOrder.totalPrice} RSD
              </li>
            ))}
          </ul>
        </div>
      )}

      {(status === "Preuzeto" || status === "DostavaUToku") && (
        <button
          onClick={async () => {
            setShowMap(true);
            if (connection) {
              try {
                await connection.invoke("GetCurrentLocation", orderId);
                console.log("📥 GetCurrentLocation invokacija poslata za", orderId);
              } catch (err) {
                console.error("❌ Greška pri povlačenju lokacije:", err);
              }
            }
          }}
        >
          📍 Prikaži lokaciju kurira
        </button>
      )}

      {showMap && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowMap(false)}>✖</button>
            <h4>Lokacija kurira</h4>
            {courierLocation ? (
              <MapContainer
                center={[courierLocation.lat, courierLocation.lng]}
                zoom={15}
                style={{ height: "800px", width: "1000px" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={[courierLocation.lat, courierLocation.lng]}>
                  <Popup>Kurir je ovde 🚚</Popup>
                </Marker>
              </MapContainer>
            ) : (
              <p>Lokacija nije dostupna...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
