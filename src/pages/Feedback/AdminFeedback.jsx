import React, { useState, useEffect, useMemo } from "react";
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
import { Line } from "react-chartjs-2";
import { feedbackService } from "../../services/feedbackService";
import "./../../styles/feedbackSurvey.scss";

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

export default function AdminFeedbackDashboard() {
  const [questions, setQuestions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 1,
    pageNumber: 1,
    pageSize: 5,
  });
  const [loading, setLoading] = useState(true);

  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("none");
  const [period, setPeriod] = useState("month");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [filters, setFilters] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const fetchFeedbacks = async (customPage = 1, customFilters = filters) => {
    try {
      setLoading(true);
      const data = await feedbackService.getStatistics({
        ...customFilters,
        questionId: questions[selectedQuestion]?.id,
        timeRange: period,
        searchTerm: search,
        pageNumber: customPage,
        pageSize: pagination.pageSize,
      });

      setFeedbacks(data.items || []);
      setPagination({
        totalCount: data.totalCount,
        totalPages: data.totalPages,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize,
      });
    } catch (err) {
      console.error("Greška pri učitavanju podataka:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitial = async () => {
      try {
        setLoading(true);
        const qData = await feedbackService.getAllQuestions();
        setQuestions(qData);

        const data = await feedbackService.getStatistics({
          questionId: qData[0].id,
          timeRange: "LastMonth",
          sortField: "UserName",
          sortOrder: "ASC",
          searchTerm: "",
          pageNumber: 1,
          pageSize: 5,
        });

        setFeedbacks(data.items || []);
        setPagination({
          totalCount: data.totalCount,
          totalPages: data.totalPages,
          pageNumber: data.pageNumber,
          pageSize: data.pageSize,
        });

        setChartOptions({
          responsive: true,
          plugins: {
            legend: { display: true, position: "top" },
            title: {
              display: true,
              text: `Kretanje ocene za pitanje: ${qData[selectedQuestion]?.text || ""}`,
              font: { size: 16 },
            },
          },
          scales: {
            y: { min: 0, max: 5, ticks: { stepSize: 1 } },
            x: { title: { display: true, text: "Datum" } },
          },
        });
      } catch (e) {
        console.error("Greška pri inicijalnom učitavanju:", e);
      } finally {
        setLoading(false);
      }
    };
    loadInitial();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    if (questions.length > 0)
      fetchFeedbacks(1, {
        ...filters,
        searchTerm: debouncedSearch,
        sortField: sortOption.includes("user")
          ? "UserName"
          : sortOption.includes("date")
          ? "Date"
          : "Rating",
        sortOrder: sortOption.includes("Asc") ? "ASC" : "DESC",
        timeRange: period,
      });
  }, [debouncedSearch, sortOption, period, selectedQuestion]);

  useEffect(() => {
    if (questions.length === 0) return;
    setChartOptions((prev) => ({
      ...prev,
      plugins: {
        ...prev.plugins,
        title: {
          ...prev.plugins?.title,
          text: `Kretanje ocene za pitanje: ${questions[selectedQuestion]?.text || ""}`,
        },
      },
    }));
  }, [selectedQuestion]);

  const chartData = useMemo(() => {
    if (!feedbacks.length) return { labels: [], datasets: [] };
    const sorted = [...feedbacks].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    return {
      labels: sorted.map((f) => new Date(f.createdAt).toLocaleString("sr-RS")),
      datasets: [
        {
          label: "Ocena korisnika",
          data: sorted.map((f) => f.rating),
          borderColor: "#b96d34",
          backgroundColor: "#b96d34",
          tension: 0.3,
        },
      ],
    };
  }, [feedbacks]);

  const overallStats = useMemo(() => {
    if (!feedbacks.length) return { total: 0, avg: 0 };
    const ratings = feedbacks.map((f) => f.rating);
    const total = ratings.length;
    const avg = total
      ? (ratings.reduce((a, b) => a + b, 0) / total).toFixed(2)
      : 0;
    return { total, avg };
  }, [feedbacks]);

  const goToPage = (num) => {
    if (num < 1 || num > pagination.totalPages) return;
    fetchFeedbacks(num);
  };

  // funckija za odredjivanje stranica
  const generatePageNumbers = () => {
    const pages = [];
    const { totalPages, pageNumber } = pagination;
    const maxVisible = 5;
    let start = Math.max(1, pageNumber - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  if (loading) return <span>Loading in progress...</span>;

  return (
    <div className="survey-container">
      <h2>Analitika utisaka korisnika</h2>

      <div className="admin-controls">
        <input
          type="text"
          placeholder="Pretraga po korisniku ili komentaru..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="userAsc">Korisnik A-Z</option>
          <option value="userDesc">Korisnik Z-A</option>
          <option value="dateAsc">Datum Rastuće</option>
          <option value="dateDesc">Datum Opadajuće</option>
          <option value="ratingAsc">Ocena Rastuće</option>
          <option value="ratingDesc">Ocena Opadajuće</option>
        </select>

        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="LastWeek">Poslednja nedelja</option>
          <option value="LastMonth">Poslednji mesec</option>
          <option value="Last3Months">Poslednja 3 meseca</option>
          <option value="LastYear">Poslednja godina</option>
        </select>
      </div>

      <div className="question-selector">
        <label>Izaberite pitanje:</label>
        <select
          value={selectedQuestion}
          onChange={(e) => setSelectedQuestion(Number(e.target.value))}
        >
          {questions.map((q, i) => (
            <option key={q.id} value={i}>
              {q.text}
            </option>
          ))}
        </select>
      </div>

      <div className="stats-summary">
        <p>
          Ukupan broj ocena: <strong>{overallStats.total}</strong>
        </p>
        <p>
          Prosečna ocena: <strong>{overallStats.avg}</strong>
        </p>
      </div>

      <div className="chart-container">
        <Line data={chartData} options={chartOptions} />
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
          {feedbacks.map((f, i) => (
            <tr key={i}>
              <td>{f.userFullName}</td>
              <td>{new Date(f.createdAt).toLocaleString("sr-RS")}</td>
              <td>{f.rating}</td>
              <td>{f.comment || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-container">
        <button
          className="page-btn page-nav"
          onClick={() => goToPage(1)}
          disabled={pagination.pageNumber === 1}
        >
          ⏮ 
        </button>

        <button
          className="page-btn page-nav"
          onClick={() => goToPage(pagination.pageNumber - 1)}
          disabled={pagination.pageNumber === 1}
        >
          ◀ 
        </button>

        {generatePageNumbers().map((num, index) =>
          num === "..." ? (
            <span key={index} className="ellipsis">...</span>
          ) : (
            <button
              key={num}
              className={`page-btn ${num === pagination.pageNumber ? "active" : ""}`}
              onClick={() => goToPage(num)}
            >
              {num}
            </button>
          )
        )}

        <button
          className="page-btn page-nav"
          onClick={() => goToPage(pagination.pageNumber + 1)}
          disabled={pagination.pageNumber === pagination.totalPages}
        >
           ▶
        </button>

        <button
          className="page-btn page-nav"
          onClick={() => goToPage(pagination.totalPages)}
          disabled={pagination.pageNumber === pagination.totalPages}
        >
           ⏭
        </button>
      </div>

    </div>
  );
}
