// steps/StepEnterTimes.js
import React from "react";

export default function StepEnterTimes({
  selectedDates,
  timesByDate,
  setTimesByDate,
  dailyValid,
  weeklyValid,
  totals,
  onBack,
  onNext
}) {
  const setTime = (date, field, value) => {
    setTimesByDate({
      ...timesByDate,
      [date]: { ...(timesByDate[date] || {}), [field]: value }
    });
  };

  return (
    <div className="wizard-step">
      <h4>Korak 2: Unesi radno vreme</h4>

      <div className="times-list">
        {selectedDates.map((d) => (
          <div key={d} className="time-row">
            <span className="date-label">{d}</span>
            <input
              type="time"
              value={timesByDate[d]?.start || ""}
              onChange={(e) => setTime(d, "start", e.target.value)}
            />
            <input
              type="time"
              value={timesByDate[d]?.end || ""}
              onChange={(e) => setTime(d, "end", e.target.value)}
            />
            <span className="hours-info">
              {totals.perDay[d] ? `${totals.perDay[d].toFixed(1)}h` : "—"}
            </span>
          </div>
        ))}
      </div>

      {/* Validacija */}
      <div className="validation-info">
        {!dailyValid && <p>Proveri da je za svaki dan trajanje ≥ 0 i ≤ 10h.</p>}
        {!weeklyValid && <p>Ukupno sati ne sme biti preko 40h nedeljno.</p>}
      </div>

      {/* Progress bar za ukupne sate */}
      <div className="weekly-progress">
        <p>Ukupno sati: {totals.weekly.toFixed(1)} / 40h</p>
        <progress value={totals.weekly} max="40"></progress>
      </div>

      <div className="wizard-actions">
        <button onClick={onBack}>Nazad</button>
        <button onClick={onNext}>Dalje</button>
      </div>
    </div>
  );
}
