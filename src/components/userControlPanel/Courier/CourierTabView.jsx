// CourierTabView.js
import React, { useMemo, useState } from "react";
import StepSelectDays from "./steps/StepSelectDays";
import StepEnterTimes from "./steps/StepEnterTimes";
import StepReviewConfirm from "./steps/StepReviewConfirm";


const MAX_DAYS = 7;

export default function CourierTabView({ existing = [], onConfirm }) {
  const [step, setStep] = useState(1);
  const [selectedDates, setSelectedDates] = useState([]);
  const [timesByDate, setTimesByDate] = useState({});

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const canProceedFromStep1 = selectedDates.length > 0 && selectedDates.length <= MAX_DAYS;

  const totals = useMemo(() => {
    let weekly = 0;
    const perDay = {};
    for (const d of selectedDates) {
      const t = timesByDate[d];
      if (!t?.start || !t?.end) continue;
      const [sh, sm] = t.start.split(":").map(Number);
      const [eh, em] = t.end.split(":").map(Number);
      const dayHours = (eh + em / 60) - (sh + sm / 60);
      perDay[d] = dayHours;
      if (dayHours > 0) weekly += dayHours;
    }
    return { weekly, perDay };
  }, [selectedDates, timesByDate]);

  const dailyValid = selectedDates.every((d) => {
    const h = totals.perDay[d];
    return h && h > 0 && h <= 10;
  });

  const weeklyValid = totals.weekly <= 40;
  const canProceedFromStep2 = dailyValid && weeklyValid;

  const payload = selectedDates.map((d) => ({
    date: d,
    workStart: timesByDate[d]?.start,
    workEnd: timesByDate[d]?.end,
  }));

  return (
    <div className="wizard">
      {step === 1 && (
        <StepSelectDays
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
          maxDays={MAX_DAYS}
          onNext={() => canProceedFromStep1 ? next() : alert(`Izaberi 1 do ${MAX_DAYS} dana.`)}
        />
      )}

      {step === 2 && (
        <StepEnterTimes
          selectedDates={selectedDates}
          timesByDate={timesByDate}
          setTimesByDate={setTimesByDate}
          dailyValid={dailyValid}
          weeklyValid={weeklyValid}
          onBack={back}
          onNext={() => canProceedFromStep2 ? next() : alert("Proveri vremena: do 10h dnevno, ukupno do 40h nedeljno.")}
          totals={totals}
        />
      )}

      {step === 3 && (
        <StepReviewConfirm
          payload={payload}
          totals={totals}
          onBack={back}
          onConfirm={() => onConfirm(payload)}
        />
      )}
    </div>
  );
}
