import React from "react";
import "../styles/main.scss";

const translations = {
    orderCount: "Ukupan broj porudžbina",
    averageOrderValue: "Prosečna zarada porudžbina (RSD)",
    totalRevenue: "Ukupna zarada (RSD)",
    totalCanceled: "Ukupan broj otkazanih porudžbina",
    averageCanceledPerDay: "Prosečno dnevnih otkazanih porudžbina",
    totalOrders: "Ukupan broj porudžbina",
    averageRevenue: "Prosečna zarada (RSD)",
};

const StatShortSummary = ({ data }) => {
    const { daily, ...rest } = data;

    const formatValue = (value) => {
        if (typeof value === "number") {
            return Number.isInteger(value) ? value : value.toFixed(2);
        }
        return value;
    };

    return (
        <div className="stats-summary">
            {Object.entries(rest).map(([key, value]) => (
                <p key={key}>
                    {translations[key] || key}: <strong>{formatValue(value)}</strong>
                </p>
            ))}
        </div>
    );
};

export default StatShortSummary;
