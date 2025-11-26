import React, { useEffect, useState } from "react";
import * as RatingService from "../../../../../services/rating.services.jsx";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as signalR from "@microsoft/signalr";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  shadowUrl: markerShadow,
});

export default function DeliveryTracking({ onCompleted }) {
  const [status, setStatus] = useState("Loading");
  const [eta, setEta] = useState(null);
  const [readyAt, setReadyAt] = useState(null);
  const [deliveryMessageLines, setDeliveryMessageLines] = useState([]);
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
      localStorage.setItem("courierId", customerOrder.courierId);
      setCustomerOrder(customerOrder);

      const newStatus = customerOrder?.status ?? "Loading";
      setStatus(newStatus);
      setItems(customerOrder?.items ?? []);

      if (customerOrder?.estimatedReadyAt) {
        setReadyAt(new Date(customerOrder.estimatedReadyAt));
      }

      if (customerOrder?.estimatedDeliveryAt) {
        setEta(new Date(customerOrder.estimatedDeliveryAt));
      }

      if (customerOrder?.deliveryEstimateMessage) {
        const lines = customerOrder.deliveryEstimateMessage
          .split(".")
          .map((line) => line.trim())
          .filter((line) => line.length > 0);
        setDeliveryMessageLines(lines);
      }

      if (customerOrder?.courierLocation) {
        setCourierLocation(customerOrder.courierLocation);
      }
    } catch (err) {
      console.error("Greška pri osvežavanju statusa:", err);
    }
  };

  useEffect(() => {
    if (!orderId) return;
    fetchStatus();
    const interval = setInterval(() => fetchStatus(), 5000);
    return () => clearInterval(interval);
  }, [orderId]);

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
        setCourierLocation({ lat: location.lat, lng: location.lng });
      } catch (err) {
        console.error("Greška pri obradi lokacije:", err);
      }
    });

    const startConnection = async () => {
      try {
        await conn.start();
        await conn.invoke("JoinOrder", orderId);
      } catch (err) {
        console.error("Greška pri startovanju SignalR konekcije:", err);
      }
    };

    startConnection();
    setConnection(conn);

    return () => {
      conn.stop().catch((err) => {
        console.error("Greška pri zatvaranju konekcije:", err);
      });
    };
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

      {readyAt &&
        (status === "Prihvacena" || status === "CekaSePreuzimanje") && (
          <p>
            Hrana spremna oko: <strong>{formatTime24h(readyAt)} 🍽️</strong>
          </p>
        )}

      {eta && (
        <p>
          Procena dostave: <strong>{formatTime24h(eta)} ⏰</strong>
        </p>
      )}

      {deliveryMessageLines.length > 0 && (
        <div className="delivery-message">
          {deliveryMessageLines.map((line, idx) => (
            <p key={idx}>
              • {idx === 1 ? <strong>{line}.</strong> : `${line}.`}
            </p>
          ))}
        </div>
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
              } catch (err) {
                console.error("Greška pri povlačenju lokacije:", err);
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h4>Lokacija kurira</h4>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => setShowMap(false)}>✖ Zatvori</button>
                <button
                  onClick={async () => {
                    if (connection) {
                      try {
                        await connection.invoke("GetCurrentLocation", orderId);
                        console.log("🔄 Osvežavanje lokacije kurira...");
                      } catch (err) {
                        console.error("Greška pri osvežavanju lokacije:", err);
                      }
                    }
                  }}
                >
                  🔄 Osveži lokaciju
                </button>
              </div>
            </div>

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