import React, { useEffect, useState } from "react";
import { getMySchedules, updateMySchedules } from "../../../services/courier.services.jsx";
import CourierTabView from "./CourierTabView";
import WeeklyScheduleReview from "./steps/WeeklyScheduleReview.jsx"; // nova komponenta

export default function CourierTabContainer({ active, profile }) {
  
  const [existing, setExisting] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const myProfile = JSON.parse(sessionStorage.getItem("myProfile"));
  const roles = myProfile?.roles || [];

  useEffect(() => {
    if (!roles.includes("Courier")) return;
    const fetch = async () => {
      try {
        const data = await getMySchedules();
        setExisting(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Greška pri učitavanju rasporeda:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (!roles.includes("Courier")) {
    return (
      <section id="courier-view" className={active}>
        <p>Ova sekcija je dostupna samo kuririma.</p>
      </section>
    );
  }

  if (loading) {
    return (
      <section id="courier-view" className={active}>
        <p>Učitavanje rasporeda...</p>
      </section>
    );
  }

  const handleConfirm = async (payload) => {
    try {
      console.log("Šaljem payload za čuvanje rasporeda:", payload);
      await updateMySchedules(payload);
      console.log("Raspored uspešno sačuvan.");
      window.location.reload();
    } catch (err) {
      console.error("Greška pri čuvanju rasporeda:", err);
      alert("Nije moguće sačuvati raspored. Proveri vremena i pokušaj ponovo.");
    }
  };

  return (
    <section id="courier-view" className={active}>
      <h3>🚴 Kurir raspored</h3>

      {existing.length === 0 || editing ? (
        <CourierTabView existing={existing} onConfirm={handleConfirm} />
      ) : (
        <WeeklyScheduleReview schedules={existing} onEdit={() => setEditing(true)} />
      )}
    </section>
  );
}
