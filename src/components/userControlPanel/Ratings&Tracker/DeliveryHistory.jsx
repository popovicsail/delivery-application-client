import React, { useEffect, useState } from "react";
import { 
    getByCustomer, 
    getByCourier 
} from "../../../services/order.services.jsx";

export default function DeliveryHistory({ active }) {
  const [orders, setOrders] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 5;

  const myProfileRaw = sessionStorage.getItem("myProfile");
  const myProfile = myProfileRaw ? JSON.parse(myProfileRaw) : null;

  // normalizacija role
  const roles = myProfile?.user?.roles;
  const role = Array.isArray(roles) ? roles[0] : roles;

  let userId;
  if (role === "Customer") {
    userId = myProfile?.user?.customerId;
  } else if (role === "Courier") {
    userId = myProfile?.user?.courierId;
  }

  const fetchHistory = async () => {
    let data;
    if (role === "Customer") {
      data = await getByCustomer(userId, page, pageSize); 
      // ovde backend vraća { items, totalCount }
      setOrders(data.items || []);
      setTotalCount(data.totalCount || 0);
    } else if (role === "Courier") {
      data = await getByCourier(userId, from || null, to || null, page, pageSize);
      // ovde backend vraća direktno niz
      setOrders(data.item1 || []);
      setTotalCount(data.totalCount || 0);
    }
  };
  

  useEffect(() => {
    if (active === "active") fetchHistory();
  }, [active, page]);

  return (
    <section id={`istorija-${role?.toLowerCase()}`} className={active}>
      <h3>📦 Istorija dostava ({role === "Customer" ? "kupac" : "kurir"})</h3>

      {role === "Courier" && (
        <div className="filters">
          <label>
            Od:
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label>
            Do:
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          <button onClick={() => { setPage(1); fetchHistory(); }}>Pretraži</button>
        </div>
      )}

      {orders.length === 0 ? (
        <p>Nema dostava u ovom periodu.</p>
      ) : (
        <table className="order-history-table">
          <thead>
            <tr>
              <th>Restoran</th>
              {role === "Courier" && <th>Adresa kupca</th>}
              <th>Status</th>
              <th>Datum</th>
              <th>Ukupno</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.orderId}>
                <td>{o.restaurant?.name}</td>
                {role === "Courier" && <td>{o.deliveryAddress}</td>}
                <td>{o.status}</td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td>{o.totalPrice} RSD</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        {page > 1 && <button onClick={() => setPage(page - 1)}>Prethodna</button>}
        {page * pageSize < totalCount && <button onClick={() => setPage(page + 1)}>Sledeća</button>}
      </div>
    </section>
  );
}
