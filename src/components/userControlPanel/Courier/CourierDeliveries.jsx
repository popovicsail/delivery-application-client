import React, { useEffect, useState } from "react";
import * as orderService from "../../../services/order.services.jsx";
import "../../../styles/courierPanel.scss";

export default function CourierDeliveries({ active, courierId }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const myProfile = JSON.parse(sessionStorage.getItem("myProfile"));
  const userId = myProfile?.courierId;

  // mapa statusa za lepši ispis
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

  // povuci dostave sa pollingom na 5s
  useEffect(() => {
    let interval;

    if (active === "active" && userId) {
      const fetchOrders = async () => {
        try {
          const data = await orderService.getByCourier(userId);
          setOrders(data.items);
        } catch (err) {
          console.error("Greška pri dohvatanju dostava:", err);
        }
      };

      fetchOrders(); // odmah povuci jednom
      interval = setInterval(fetchOrders, 5000); // ponavljaj na 5 sekundi
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [active, userId, refreshKey]);

  // akcije
  const pickUpDelivery = async (id) => {
    try {
      await orderService.updateOrderStatus(id, "Preuzeto");
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error("Greška pri preuzimanju dostave:", err);
    }
  };

  const startDelivery = async (id) => {
    try {
      await orderService.updateOrderStatus(id, "DostavaUToku");
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error("Greška pri pokretanju dostave:", err);
    }
  };

  const completeDelivery = async (id) => {
    try {
      await orderService.updateOrderStatus(id, "Zavrsena");
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error("Greška pri završavanju dostave:", err);
    }
  };

  // filtriraj aktivne dostave
  const activeOrders = orders.filter(o => o.status !== "Zavrsena");

  // pronađi selektovanu porudžbinu
  const selectedOrder = activeOrders.find(o => o.id === selectedOrderId);

  return (
    <div className={`tab-content ${active}`}>
      {active === "active" && (
        <>
          <h2>
            Moje dostave <span className="badge">{activeOrders.length}</span>
          </h2>

          <table className="orders-table">
            <thead>
              <tr>
                <th>Restoran</th>
                <th>Adresa</th>
                <th>Status</th>
                <th>Ukupno</th>
                <th>Akcija</th>
              </tr>
            </thead>
            <tbody>
              {activeOrders.map((o) => (
                <tr key={o.orderId}>
                  <td>{o.restaurant.name}</td>
                  <td>{o.deliveryAddress}</td>
                  <td>{statusLabels[o.status] ?? o.status}</td>
                  <td>{o.totalPrice} RSD</td>
                  <td>
                    <button
                      className="details-btn"
                      onClick={() => setSelectedOrderId(o.id)}
                    >
                      Vidi detalje
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedOrder && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Detalji dostave</h3>
                <p><strong>Restoran:</strong> {selectedOrder.restaurant.name}</p>
                <p>
                  <strong>Adresa Restorana:</strong>{" "}
                  {selectedOrder.restaurant.address.streetAndNumber},{" "}
                  {selectedOrder.restaurant.address.city}
                </p>
                <p><strong>Adresa kupca:</strong> {selectedOrder.deliveryAddress}</p>
                <p><strong>Status:</strong> {statusLabels[selectedOrder.status] ?? selectedOrder.status}</p>
                <p><strong>Ukupno:</strong> {selectedOrder.totalPrice} RSD</p>

                <h4>Stavke:</h4>
                <ul>
                  {selectedOrder.items.map((item) => (
                    <li key={item.id}>
                      {item.name} x {item.quantity} = {item.price} RSD
                    </li>
                  ))}
                </ul>

                <div className="modal-actions">
                  {selectedOrder.status === "CekaSePreuzimanje" && (
                    <button
                      className="pickup-btn"
                      onClick={() => pickUpDelivery(selectedOrder.orderId)}
                    >
                      📦 Preuzmi dostavu
                    </button>
                  )}
                  {selectedOrder.status === "Preuzeto" && (
                    <button
                      className="start-btn"
                      onClick={() => startDelivery(selectedOrder.orderId)}
                    >
                      🚚 Kreni na isporuku
                    </button>
                  )}
                  {selectedOrder.status === "DostavaUToku" && (
                    <button
                      className="complete-btn"
                      onClick={() => completeDelivery(selectedOrder.orderId)}
                    >
                      ✅ Završi dostavu
                    </button>
                  )}
                  <button
                    className="close-btn"
                    onClick={() => setSelectedOrderId(null)}
                  >
                    ❌ Zatvori
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
