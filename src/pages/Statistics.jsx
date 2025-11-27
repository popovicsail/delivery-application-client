import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
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
import "../styles/main.scss";
import { getRestaurantStats, getDishStats, getRestaurantCanceledStats } from "../services/statistics.services";
import StatShortSummary from "../components/StatShortSummary";

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

const Statistics = ({restaurantId, isRestaurant = true, dishId}) => {
    const [stats, setStats] = useState({})
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [customDate, setCustomDate] = useState(false);
    const myProfile = JSON.parse(sessionStorage.getItem("myProfile"));
    const roles = myProfile ? myProfile.user.roles : [];                 //IZBRISATI .USER
     const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const changeDate = (value) => {
        let start = new Date();
        let end = new Date();

        if (value === "7d") {
            start.setDate(start.getDate() - 7);
            setCustomDate(false);

        } else if (value === "1m") {
            start.setMonth(start.getMonth() - 1);
            setCustomDate(false);

        } else if (value === "3m") {
            start.setMonth(start.getMonth() - 3);
            setCustomDate(false);

        } else if (value === "1y") {
            start.setFullYear(start.getFullYear() - 1);
            setCustomDate(false);

        } else if (value === "custom") {
            setCustomDate(true);
            setValue("startDate", "");
            setValue("endDate", "");
            return;
        }

        const format = (d) => d.toISOString().slice(0, 10);

        setValue("startDate", format(start));
        setValue("endDate", format(end));
    };


    const onSubmit = async (data) => {
        if (data.startDate > data.endDate) {
            alert("Početni datum mora biti pre krajnjeg datuma.");
            return;
        }

        const finalStartDate = new Date(data.startDate).toISOString();
        const finalEndDate = new Date(data.endDate).toISOString();

        if(isRestaurant){
            if(roles.some((x)=>x.includes("Administrator"))){
                try {
                    setLoading(true);
                    const stats = await getRestaurantCanceledStats(
                        "e503a651-da5f-4746-9af5-4cc442b84f7e",   //ZAMENITI SA RESTAURANT ID KADA SE IMPLEMENTIRA
                        finalStartDate,
                        finalEndDate
                    );

                    setStats(stats);
                } catch (err) {
                    console.error("Greška pri učitavanju podataka:", err);
                } finally {
                    setLoading(false);
                }
            }
            else if (data.statType === "1") {
                try {
                    setLoading(true);
                    const stats = await getRestaurantStats(
                        "e503a651-da5f-4746-9af5-4cc442b84f7e",   //ZAMENITI SA RESTAURANT ID KADA SE IMPLEMENTIRA
                        finalStartDate,
                        finalEndDate
                    );

                    setStats(stats);
                } catch (err) {
                    console.error("Greška pri učitavanju podataka:", err);
                } finally {
                    setLoading(false);
                }
            }
            else if(data.statType === "2"){
                try {
                    setLoading(true);
                    const stats = await getRestaurantCanceledStats(
                        "e503a651-da5f-4746-9af5-4cc442b84f7e",   //ZAMENITI SA RESTAURANT ID KADA SE IMPLEMENTIRA
                        finalStartDate,
                        finalEndDate
                    );

                    setStats(stats);
                } catch (err) {
                    console.error("Greška pri učitavanju podataka:", err);
                } finally {
                    setLoading(false);
                }
            }
        }else{
            try {
                setLoading(true);
                const stats = await getDishStats(
                    "e503a651-da5f-4746-9af5-4cc442b84f7e",     //ZAMENITI SA RESTAURANT ID KADA SE IMPLEMENTIRA
                    "53c3e5b4-cf09-4365-a5f8-242f5aef9405",     //ZAMENITI SA DISH ID KADA SE IMPLEMENTIRA
                    finalStartDate, 
                    finalEndDate
                );

                setStats(stats);
                setError('');
            } catch (err) {
                console.error("Greška pri učitavanju podataka:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    const chartData = useMemo(() => {
        if (!stats.daily || stats.daily.length === 0)
            return { labels: [], datasets: [] };

        const valueKey = isRestaurant ? (watch("statType") === "1" ? "revenue" : "count") : "revenue";

        const sorted = [...stats.daily].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );

        return {
            labels: sorted.map((x) => new Date(x.date).toLocaleDateString("sr-RS")),
            datasets: [
                {
                    label: isRestaurant
                        ? (watch("statType") === "1"
                            ? "Zarada (RSD)"
                            : "Otkazane porudžbine")
                        : "Broj porudžbina za jelo",

                    data: sorted.map((x) => x[valueKey]),

                    borderColor: "#b96d34",
                    backgroundColor: "#b96d34",
                    tension: 0.3,
                },
            ],
        };
    }, [stats, watch("statType")]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: true, position: "top" },
            title: {
                display: true,
                text: "Statistički prikaz",
                font: { size: 16 },
            },
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };


    return (
        <div className="survey-container">
            <h2>Statistika restorana</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="admin-controls">
                {isRestaurant && !roles.some(x => x.includes("Administrator")) && (
                    <div className="form-field">
                        <select
                            {...register("statType", { required: "Morate izabrati statistiku." })}
                            defaultValue=""
                        >
                            <option value="" disabled hidden>-- Izaberite statistiku --</option>
                            <option value="1">Zarada Restorana</option>
                            <option value="2">Otkazane Porudzbine</option>
                        </select>
                        {errors.statType && <p className="error">{errors.statType.message}</p>}
                    </div>
                )}

                <div className="form-field">
                    <select
                        {...register("period", { required: "Morate izabrati vremenski period." })}
                        defaultValue=""
                        onChange={(e) => changeDate(e.target.value)}
                    >
                        <option value="" disabled hidden>-- Izaberite period --</option>
                        <option value="7d">Nedelju dana</option>
                        <option value="1m">Mesec dana</option>
                        <option value="3m">3 Meseca</option>
                        <option value="1y">Godinu dana</option>
                        <option value="custom">Custom</option>
                    </select>
                    {errors.period && <p className="error">{errors.period.message}</p>}
                </div>

                {customDate && (
                    <>
                        <div className="form-field">
                            <input
                                type="date"
                                {...register("startDate", { required: "Početni datum je obavezan." })}
                            />
                            {errors.startDate && <p className="error">{errors.startDate.message}</p>}
                        </div>

                        <div className="form-field">
                            <input
                                type="date"
                                {...register("endDate", { required: "Krajnji datum je obavezan." })}
                            />
                            {errors.endDate && <p className="error">{errors.endDate.message}</p>}
                        </div>
                    </>
                )}

                <button type="submit">Prikaži</button>
            </form>


            {stats.daily && stats.daily.length === 0 &&
                <div>Nema podataka za izabrani period</div>
            }
            
            {stats.daily && stats.daily.length > 0 &&
            <StatShortSummary data={stats}/>
            }

            {stats.daily && stats.daily.length > 0 && (
                <div className="chart-container">
                    <Line data={chartData} options={chartOptions} />
                </div>
            )}
        </div>
    );
};
export default Statistics;
