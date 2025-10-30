import React, { useEffect, useState } from "react";
import * as restaurantService from "../../../services/restaurant.services.jsx";
import * as orderService from "../../../services/order.services.jsx";

export default function OwnerOrders({active }) {


  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // povuci restorane vlasnika
  useEffect(() => {
    if (active === "active") {
      (async () => {
        try {
          const data = await restaurantService.getMyRestaurants(); // ako već vraća JSON
          setRestaurants(data);
          console.log("Dohvaćeni restorani:", data);
        } catch (err) {
          console.error("Greška pri dohvatanju restorana:", err);
        }
      })();
    }
  }, [active]);

  // povuci porudžbine za izabrani restoran
  useEffect(() => {
    if (selectedRestaurant) {
      (async () => {
        try {
          const data = await orderService.getByRestaurant(selectedRestaurant);
          setOrders(data);
            console.log("Dohvaćene porudžbine:", data);
        } catch (err) {
          console.error("Greška pri dohvatanju porudžbina:", err);
        }
      })();
    } else {
      setOrders([]);
    }
  }, [selectedRestaurant]);

  const acceptOrder = async (id) => {
    try {
      const response = await orderService.updateOrderStatus(id,1);
      console.log("API Response:", response);
  
      setSelectedOrder((prev) => ({ ...prev, status: "Prihvacena" }));
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === id ? { ...o, status: "Prihvacena" } : o
        )
      );

      
    } catch (error) {
      console.error("Greška pri ažuriranju statusa:", error);
    }
  };

  const refuseOrder = async (id) => {
    try {
      const response = await orderService.updateOrderStatus(id,2);
      console.log("API Response:", response);
  
      setSelectedOrder((prev) => ({ ...prev, status: "Odbijena" }));
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === id ? { ...o, status: "Odbijena" } : o
        )
      );

      
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
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td>{o.customerName}</td>
                        <td>{o.deliveryAddress}</td>
                        <td>{o.status}</td>
                        <td>{o.totalPrice} RSD</td>
                        <td>
                          <button onClick={() => setSelectedOrder(o)}>
                            Detalji
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          ) : (
            <>
              <button className = "button" onClick={() => setSelectedOrder(null)}>← Nazad</button>
              <h3>Detalji porudžbine</h3>
              <p><strong>Kupac:</strong> {selectedOrder.customerName}</p>
              <p><strong>Adresa:</strong> {selectedOrder.deliveryAddress}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Ukupno:</strong> {selectedOrder.totalPrice} RSD</p>

              <h4>Stavke:</h4>
              <ul>
                {selectedOrder.items.map(item => (
                  <li key={item.id}>
                    {item.dishName} x {item.quantity} = {item.price} RSD
                  </li>
                ))}
              </ul>

                {selectedOrder.status === "NaCekanju" && (
                    <button key={selectedOrder.orderId} className= "accept-btn" onClick={() => acceptOrder(selectedOrder.orderId)}>
                        Prihvati porudžbinu
                    </button>
                )}
                {selectedOrder.status === "NaCekanju" && (
                    <button key={selectedOrder.orderId} className= "refuse-btn" onClick={() => refuseOrder(selectedOrder.orderId)}>
                        Odbij porudžbinu
                    </button>
                )}
            </>
          )}
        </>
      )}
    </div>
  );
}
