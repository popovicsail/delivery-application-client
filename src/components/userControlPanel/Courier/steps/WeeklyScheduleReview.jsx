import React from "react";

// schedules je niz iz backenda u formatu { weekDay, workStart, workEnd }
export default function WeeklyScheduleReview({ schedules }) {
  // helper da generiše 7 dana od ponedeljka do nedelje
  const getWeekDays = () => {
    const today = new Date();
    // nađi ponedeljak tekuće nedelje
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

  const weekDays = getWeekDays();

  // mapiraj schedule po weekDay
  const scheduleMap = {};
  schedules.forEach(s => {
    scheduleMap[s.weekDay] = s;
  });

  const formatDate = (d) =>
    d.toLocaleDateString("sr-RS", { day: "2-digit", month: "2-digit" });

  const formatDayName = (d) =>
    d.toLocaleDateString("en-US", { weekday: "long" });

  // helper da prikaže samo HH:mm
  const formatTime = (time) => {
    if (!time) return "";
    // očekuje se "HH:mm:ss" → uzmi prva 5 karaktera
    return time.substring(0, 5);
  };

  return (
    <div className="wizard-step">
      <h4>Raspored za narednu nedelju</h4>
      <table className="review-table">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Dan</th>
            <th>Početak</th>
            <th>Kraj</th>
          </tr>
        </thead>
        <tbody>
          {weekDays.map((d) => {
            const dayName = formatDayName(d);
            const sched = scheduleMap[dayName.charAt(0).toUpperCase() + dayName.slice(1)];
            return (
              <tr key={d.toISOString()}>
                <td>{formatDate(d)}</td>
                <td>{dayName}</td>
                <td>{sched ? formatTime(sched.workStart) : ""}</td>
                <td>{sched ? formatTime(sched.workEnd) : ""}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
