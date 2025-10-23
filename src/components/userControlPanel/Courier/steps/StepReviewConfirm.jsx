import React from "react";

export default function StepReviewConfirm({ payload, totals, onBack, onConfirm }) {
  return (
    <div className="wizard-step">
      <h4>Korak 3: Pregled i potvrda</h4>

      {/* 🔔 Obaveštenje */}
      <div className="alert alert-warning" style={{ marginBottom: "1rem" }}>
        ⚠️ Jednom kada potvrdite nedeljni raspored, on se više ne može menjati.
      </div>

      {payload.length === 0 ? (
        <p>Nema izabranih dana.</p>
      ) : (
        <table className="review-table">
          <thead>
            <tr>
              <th>Datum</th>
              <th>Početak</th>
              <th>Kraj</th>
              <th>Sati</th>
            </tr>
          </thead>
          <tbody>
            {payload.map((p) => {
              const h = totals.perDay[p.date] || 0;
              return (
                <tr key={p.date}>
                  <td>{p.date}</td>
                  <td>{p.workStart}</td>
                  <td>{p.workEnd}</td>
                  <td>{h.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3">Ukupno</td>
              <td>{totals.weekly.toFixed(2)}h</td>
            </tr>
          </tfoot>
        </table>
      )}

      <div className="wizard-actions">
        <button onClick={onBack}>Nazad</button>
        <button onClick={onConfirm}>Potvrdi raspored</button>
      </div>
    </div>
  );
}
