import React, { useEffect, useState } from "react";
import * as restaurantService from "../../../services/restaurant.services.jsx";
import * as orderService from "../../../services/order.services.jsx";

export default function OwnerOrders({ active }) {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null); // pristup 2: samo ID
  const [showPrepTimeModal, setShowPrepTimeModal] = useState(false);
  const [prepTime, setPrepTime] = useState(20);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCompleted, setShowCompleted] = useState(false); // filter toggle

  // Fetch restaurants
  useEffect(() => {
    if (active === "active") {
      (async () => {
        try {
          const data = await restaurantService.getMyRestaurants();
          setRestaurants(data);
        } catch (err) {
          console.error("Greška pri dohvatanju restorana:", err);
        }
      })();
    }
  }, [active]);

  // Fetch orders for selected restaurant + auto refresh every 10s
  useEffect(() => {
    let interval;
    if (selectedRestaurant) {
      const fetchOrders = async () => {
        try {
          const data = await orderService.getByRestaurant(selectedRestaurant);
          setOrders(data);
        } catch (err) {
          console.error("Greška pri dohvatanju porudžbina:", err);
        }
      };

      fetchOrders(); // initial
      interval = setInterval(fetchOrders, 5000);
    } else {
      setOrders([]);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedRestaurant, refreshKey]);

  // Selected order from the same list the table uses
  const filteredOrders = showCompleted
    ? orders
    : orders.filter(o => o.status !== "Zavrsena");

  const selectedOrder = filteredOrders.find(o => o.orderId === selectedOrderId);

  // Actions (use orderId consistently)
  const acceptOrder = async (orderId) => {
    try {
      await orderService.updateOrderStatus(orderId, 1, prepTime);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error("Greška pri ažuriranju statusa:", error);
    }
  };

  const markAsReadyForPickup = async (orderId) => {
    try {
      await orderService.updateOrderStatus(orderId, 3);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error("Greška pri ažuriranju statusa:", error);
    }
  };

  const refuseOrder = async (orderId) => {
    try {
      await orderService.updateOrderStatus(orderId, 2);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error("Greška pri ažuriranju statusa:", error);
    }
  };

  return (
    <div className={`tab-content ${active}`}>
      {active === "active" && (
        <>
          {!selectedOrder ? (
            <>
              <h2>Porudžbine restorana</h2>

              <div className="restaurant-select">
                <label htmlFor="restaurantSelect">Izaberite restoran:</label>
                <select
                  id="restaurantSelect"
                  value={selectedRestaurant}
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                >
                  <option value="">-- Odaberite restoran --</option>
                  {restaurants.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              {selectedRestaurant && (
                <>
                  <div className="filter-toggle">
                    <label>
                      <input
                        type="checkbox"
                        checked={showCompleted}
                        onChange={() => setShowCompleted(prev => !prev)}
                      />
                      Prikaži i završene porudžbine
                    </label>
                  </div>

                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Kupac</th>
                        <th>Adresa</th>
                        <th>Status</th>
                        <th>Ukupno</th>
                        <th>Akcija</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(o => (
                        <tr key={o.orderId}>
                          <td>{o.customerName}</td>
                          <td>{o.deliveryAddress}</td>
                          <td>{o.status}</td>
                          <td>{o.totalPrice} RSD</td>
                          <td>
                            <button onClick={() => setSelectedOrderId(o.orderId)}>
                              Detalji
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </>
          ) : (
            <>
              <button className="button" onClick={() => setSelectedOrderId(null)}>← Nazad</button>
              <h3>Detalji porudžbine</h3>
              <p><strong>Kupac:</strong> {selectedOrder.customerName}</p>
              <p><strong>Adresa:</strong> {selectedOrder.deliveryAddress}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Ukupno:</strong> {selectedOrder.totalPrice} RSD</p>
              <p><strong>Vreme pripreme:</strong> {selectedOrder.timeToPrepare} min</p>

              <h4>Stavke:</h4>
              <ul>
                {selectedOrder.items.map(item => (
                  <li key={item.id}>
                    {item.dishName} x {item.quantity} = {item.price} RSD
                  </li>
                ))}
              </ul>

              {showPrepTimeModal && (
                <div className="modal-overlay">
                  <div className="modal">
                    <h3>Unesite vreme spremanja</h3>
                    <input
                      type="number"
                      value={prepTime}
                      onChange={(e) => setPrepTime(Number(e.target.value))}
                      min="5"
                      max="120"
                    />
                    <span> minuta</span>
                    <div className="modal-actions">
                      <button onClick={() => {
                        acceptOrder(selectedOrder.orderId);
                        setShowPrepTimeModal(false);
                      }}>
                        ✅ Potvrdi
                      </button>
                      <button onClick={() => setShowPrepTimeModal(false)}>
                        ❌ Otkaži
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedOrder.status === "NaCekanju" && (
                <>
                  <button
                    className="accept-btn"
                    onClick={() => setShowPrepTimeModal(true)}
                  >
                    Prihvati porudžbinu
                  </button>
                  <button
                    className="refuse-btn"
                    onClick={() => refuseOrder(selectedOrder.orderId)}
                  >
                    Odbij porudžbinu
                  </button>
                </>
              )}

              {selectedOrder.status === "Prihvacena" && (
                <button
                  className="ready-btn"
                  onClick={() => markAsReadyForPickup(selectedOrder.orderId)}
                >
                  ✅ Spremno za preuzimanje
                </button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
