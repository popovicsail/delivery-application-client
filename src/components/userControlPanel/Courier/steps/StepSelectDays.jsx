// steps/StepSelectDays.js
import React from "react";

export default function StepSelectDays({ selectedDates, setSelectedDates, maxDays, onNext }) {
  const today = new Date();
  const options = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  });

  const toggleDate = (date) => {
    const has = selectedDates.includes(date);
    if (has) {
      setSelectedDates(selectedDates.filter((d) => d !== date));
    } else {
      if (selectedDates.length >= maxDays) {
        alert(`Možeš izabrati najviše ${maxDays} dana unapred.`);
        return;
      }
      setSelectedDates([...selectedDates, date]);
    }
  };

  return (
    <div className="wizard-step">
      <h4>Korak 1: Izaberi do {maxDays} dana</h4>
      <div className="date-grid">
        {options.map((date) => (
          <label key={date} className={`date-cell ${selectedDates.includes(date) ? "selected" : ""}`}>
            <input
              type="checkbox"
              checked={selectedDates.includes(date)}
              onChange={() => toggleDate(date)}
            />
            {date}
          </label>
        ))}
      </div>
      <div className="wizard-actions">
        <button onClick={onNext}>Dalje</button>
      </div>
    </div>
  );
}
