import React, { useState, useMemo, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import "./../../styles/feedbackSurvey.scss";
import { feedbackService } from "../../services/feedbackService";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Title);


const mockFeedbacks = [
  {
    user: "Marko",
    date: "2025-10-01",
    ratings: [5, 4, 4, 5],
    comments: ["Super jednostavno!", "Brzo učitavanje", "Dizajn ok", "Odlična podrška"]
  },
  {
    user: "Jelena",
    date: "2025-10-02",
    ratings: [4, 3, 5, 4],
    comments: ["Ok", "Može bolje", "Odlično", "Dovoljno informacija"]
  },
  {
    user: "Ana",
    date: "2025-10-03",
    ratings: [5, 5, 5, 5],
    comments: ["Super", "Brzo", "Prelep dizajn", "Top podrška"]
  },
  {
    user: "Stefan",
    date: "2025-09-25",
    ratings: [3, 4, 3, 4],
    comments: ["Srednje", "Dovoljno brzo", "Može bolje", "Ok"]
  },
  {
    user: "Milan",
    date: "2025-08-15",
    ratings: [2, 3, 3, 2],
    comments: ["Sporo", "Sporo učitava", "Ne dopada mi se dizajn", "Slaba podrška"]
  },
];

export default function AdminFeedbackDashboard() {
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("none");
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [period, setPeriod] = useState("month");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true)
  const [chartOptions, setChartOptions] = useState();

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true)
        const data = await feedbackService.getAllQuestions();
        setQuestions(data)

        setChartOptions({
          responsive: true,
          plugins: {
            legend: { display: true, position: "top" },
            title: {
              display: true,
              text: `Kretanje ocene za pitanje: ${data[selectedQuestion].text}`, //Zasto ne moze da se koristi questions??????
              font: { size: 16 },
            },
          },
          scales: {
            y: { min: 0, max: 5, ticks: { stepSize: 1 } },
            x: { title: { display: true, text: "Datum" } },
          }
        })
      } catch (err) {
        console.error("Greška pri učitavanju:", err);
      } finally {
        setLoading(false)
      }
    };
    getData();
  }, []);



  const filtered = useMemo(() => {
    let data = mockFeedbacks.filter(
      (f) =>
        f.user.toLowerCase().includes(search.toLowerCase()) ||
        (f.comments[selectedQuestion] || "").toLowerCase().includes(search.toLowerCase())
    );

    if (sortOption === "userAsc") data.sort((a, b) => a.user.localeCompare(b.user));
    if (sortOption === "userDesc") data.sort((a, b) => b.user.localeCompare(a.user));
    if (sortOption === "dateAsc") data.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortOption === "dateDesc") data.sort((a, b) => new Date(b.date) - new Date(a.date));

    return data;
  }, [search, sortOption, selectedQuestion]);


  const filteredByPeriod = useMemo(() => {
    const now = new Date();
    let startDate = new Date();

    if (period === "week") startDate.setDate(now.getDate() - 7);
    else if (period === "month") startDate.setMonth(now.getMonth() - 1);
    else if (period === "3months") startDate.setMonth(now.getMonth() - 3);
    else if (period === "year") startDate.setFullYear(now.getFullYear() - 1);

    return filtered.filter((f) => new Date(f.date) >= startDate);
  }, [filtered, period]);

  const chartData = useMemo(() => {
    const map = {};
    filteredByPeriod.forEach((f) => {
      const day = f.date;
      if (!map[day]) map[day] = [];
      map[day].push(f.ratings[selectedQuestion]);
    });
    const sortedEntries = Object.entries(map).sort(
      ([d1], [d2]) => new Date(d1) - new Date(d2)
    );
    return sortedEntries.map(([date, ratings]) => ({
      date,
      avg: ratings.reduce((a, b) => a + b, 0) / ratings.length,
    }));
  }, [filteredByPeriod, selectedQuestion]);

  const overallStats = useMemo(() => {
    const allRatings = filteredByPeriod.map((f) => f.ratings[selectedQuestion]);
    const total = allRatings.length;
    const avg = total
      ? (allRatings.reduce((a, b) => a + b, 0) / total).toFixed(2)
      : 0;
    return { total, avg };
  }, [filteredByPeriod, selectedQuestion]);

  const chartConfig = {
    labels: chartData.map((d) => d.date),
    datasets: [
      {
        label: "Prosečna ocena po danu",
        data: chartData.map((d) => d.avg),
        fill: false,
        borderColor: "#b96d34",
        backgroundColor: "#b96d34",
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };


  if (loading) {
    return <span>Loading in progress...</span>
  } else if (!loading)

    return (
      <div className="survey-container admin-view">
        <h2>Analitika utisaka korisnika</h2>

        <div className="admin-controls">
          <input
            type="text"
            placeholder="Pretraga po korisniku ili komentaru..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="none">Bez sortiranja</option>
            <option value="userAsc">Korisnik A-Z</option>
            <option value="userDesc">Korisnik Z-A</option>
            <option value="dateAsc">Datum ↑</option>
            <option value="dateDesc">Datum ↓</option>
          </select>

          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="week">Poslednja nedelja</option>
            <option value="month">Poslednji mesec</option>
            <option value="3months">Poslednja 3 meseca</option>
            <option value="year">Poslednja godina</option>
          </select>
        </div>

        <div className="question-selector">
          <label>Izaberite pitanje:</label>
          <select
            value={selectedQuestion}
            onChange={(e) => setSelectedQuestion(Number(e.target.value))}
          >
            {questions.map((q, i) => (
              <option key={i} value={i}>
                {q.text}
              </option>
            ))}
          </select>
        </div>

        <div className="stats-summary">
          <p>Ukupan broj ocena: <strong>{overallStats.total}</strong></p>
          <p>Prosečna ocena: <strong>{overallStats.avg}</strong></p>
        </div>

        <div className="chart-container">
          <Line data={chartConfig} options={chartOptions} />
        </div>

        <table className="feedback-table">
          <thead>
            <tr>
              <th>Korisnik</th>
              <th>Datum</th>
              <th>Ocena</th>
              <th>Komentar</th>
            </tr>
          </thead>
          <tbody>
            {filteredByPeriod.map((f, i) => (
              <tr key={i}>
                <td>{f.user}</td>
                <td>{f.date}</td>
                <td>{f.ratings[selectedQuestion]}</td>
                <td>{f.comments[selectedQuestion] || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    );
}
