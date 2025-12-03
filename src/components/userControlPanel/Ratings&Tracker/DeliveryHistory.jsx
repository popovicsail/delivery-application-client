import React, { useEffect, useState } from "react";
import { 
    getByCustomer, 
    getByCourier ,
    getBillPdf
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
  const roles = myProfile?.roles;
  const role = Array.isArray(roles) ? roles[0] : roles;

  let userId;
  if (role === "Customer") {
    userId = myProfile.customerId;
  } else if (role === "Courier") {
    userId = myProfile.courierId;
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
      setOrders(data.items || []);
      setTotalCount(data.totalCount || 0);
    }
  };
  
  const handleBillPdf = async (orderId) => {
    try {
      const blob = await getBillPdf(orderId);

      const url = window.URL.createObjectURL(new Blob([blob]));

      const link = document.createElement('a');
      link.href = url;
      
      link.setAttribute('download', `racun-${orderId}.pdf`); 

      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Greška pri preuzimanju računa:", error);
      if (error.response && error.response.status === 404) {
          alert("Račun za ovu porudžbinu još nije generisan.");
      } else {
          alert("Došlo je do greške prilikom preuzimanja računa.");
      }
    }
  }

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
              <th>Preuzmi Račun</th>
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
                <td><button onClick={() => handleBillPdf(o.orderId)}>Račun</button></td>
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
