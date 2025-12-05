import React, { useEffect, useState } from "react";
import * as restaurantService from "../../../services/restaurant.services.jsx";
import * as orderService from "../../../services/order.services.jsx";

export default function OwnerOrders({ active }) {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showPrepTimeModal, setShowPrepTimeModal] = useState(false);
  const [prepTime, setPrepTime] = useState(20);
  const [refreshKey, setRefreshKey] = useState(0);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const [showCompleted, setShowCompleted] = useState(false);

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

  // Fetch orders for selected restaurant + auto refresh
  useEffect(() => {
    let interval;
    if (selectedRestaurant) {
      const fetchOrders = async () => {
        try {
          const data = await orderService.getByRestaurant(
            selectedRestaurant,
            from || null,
            to || null,
            page,
            pageSize
          );
          setOrders(data.items || []);
          setTotalCount(data.totalCount || 0);
        } catch (err) {
          console.error("Greška pri dohvatanju porudžbina:", err);
        }
      };

      fetchOrders();
      interval = setInterval(fetchOrders, 5000);
    } else {
      setOrders([]);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedRestaurant, refreshKey, page, from, to]);

  // filtriranje
  const filteredOrders = orders.filter((o) => {
    const orderDate = new Date(o.createdAt);

    if (!showCompleted) {
      return o.status !== "Zavrsena" && o.status !== "Odbijena";
    }

    if (from && orderDate < new Date(from)) return false;
    if (to && orderDate > new Date(to)) return false;

    return true;
  });

  const selectedOrder = filteredOrders.find((o) => o.orderId === selectedOrderId);

  // Actions
  const acceptOrder = async (orderId) => {
    try {
      await orderService.updateOrderStatus(orderId, "Prihvacena", prepTime);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Greška pri ažuriranju statusa:", error);
    }
  };

  const refuseOrder = async (orderId) => {
    try {
      await orderService.updateOrderStatus(orderId, "Odbijena");
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Greška pri ažuriranju statusa:", error);
    }
  };

  const markAsReadyForPickup = async (orderId) => {
    try {
      await orderService.updateOrderStatus(orderId, "CekaSePreuzimanje");
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Greška pri ažuriranju statusa:", error);
    }
  };

  // Pagination helpers
  const totalPages = Math.ceil(totalCount / pageSize);

  const getPageNumbers = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
  
    if (page === 1) {
      return [1, 2, 3];
    }
  
    if (page === 2) {
      return [1, 2, 3];
    }
  
    if (page === totalPages) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }
  
    if (page === totalPages - 1) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }
  
    // u svim ostalim slučajevima izabrana stranica je u sredini
    return [page - 1, page, page + 1];
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
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedRestaurant && (
                <>
                  {/* Checkbox */}
                  <div className="filter-toggle">
                    <label>
                      <input
                        type="checkbox"
                        checked={showCompleted}
                        onChange={() => setShowCompleted((prev) => !prev)}
                      />
                      Prikaži i završene / odbijene porudžbine
                    </label>
                  </div>

                  {/* Filteri se prikazuju samo ako je checkbox uključen */}
                  {showCompleted && (
                    <div className="filters">
                      <label>
                        Od:
                        <input
                          type="date"
                          value={from}
                          onChange={(e) => setFrom(e.target.value)}
                        />
                      </label>
                      <label>
                        Do:
                        <input
                          type="date"
                          value={to}
                          onChange={(e) => setTo(e.target.value)}
                        />
                      </label>
                      <button
                        onClick={() => {
                          setPage(1);
                          setRefreshKey((prev) => prev + 1);
                        }}
                      >
                        Pretraži
                      </button>
                    </div>
                  )}

                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Datum</th>
                        <th>Kupac</th>
                        <th>Adresa</th>
                        <th>Status</th>
                        <th>Ukupno</th>
                        <th>Akcija</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((o) => (
                        <tr key={o.orderId}>
                          <td>{new Date(o.createdAt).toLocaleString()}</td>
                          <td>{o.customerName}</td>
                          <td>{o.deliveryAddress}</td>
                          <td>{statusLabels[o.status] ?? o.status}</td>
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

                  {/* Paginacija */}
                  {showCompleted && (
                    <div className="pagination">
                      {getPageNumbers().map((num) => (
                        <button
                          key={num}
                          onClick={() => setPage(num)}
                          className={num === page ? "active" : ""}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  )}

                </>
              )}
            </>
          ): (
            <>
              <button className="button" onClick={() => setSelectedOrderId(null)}>← Nazad</button>
              <h3>Detalji porudžbine</h3>
              <p><strong>Kupac:</strong> {selectedOrder.customerName}</p>
              <p><strong>Adresa:</strong> {selectedOrder.deliveryAddress}</p>
              <p><strong>Status:</strong> {statusLabels[selectedOrder.status] ?? selectedOrder.status}</p>
              <p><strong>Ukupno:</strong> {selectedOrder.totalPrice} RSD</p>
              <p><strong>Vreme pripreme:</strong> {selectedOrder.timeToPrepare} min</p>

              <h4>Stavke:</h4>
              <ul>
                {selectedOrder.items.map(item => {
                  const itemTotal = (item.dishPrice + item.optionsPrice) 
                                    * item.quantity 
                                    * (1 - item.discountRate);

                  return (
                    <li key={item.id}>
                      {item.name} x {item.quantity} = {itemTotal} RSD
                    </li>
                  );
                })}
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
