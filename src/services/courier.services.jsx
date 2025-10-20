import api from "./api.jsx";

export async function getMySchedules() {
  const response = await api.get("/Couriers/work-schedules");
  return Array.isArray(response.data) ? response.data : [];
}

export async function updateMySchedules(schedules) {
    const payload = { schedules: convertToDtoPayload(schedules) };
    const response = await api.put("/Couriers/work-schedules", payload, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  }


  function convertToDtoPayload(dates) {
    return dates.map(d => {
      const weekDay = new Date(d.date).toLocaleDateString("en-US", { weekday: "long" });
      return {
        weekDay,
        workStart: d.workStart.length === 5 ? d.workStart + ":00" : d.workStart,
        workEnd: d.workEnd.length === 5 ? d.workEnd + ":00" : d.workEnd
      };
    });
  }




  