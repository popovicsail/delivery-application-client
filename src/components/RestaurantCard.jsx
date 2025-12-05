import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import "../styles/main.scss";

// ✅ Custom marker ikona
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
});

const RestaurantCard = ({ restaurant, handleDelete, isForOwner, handleCardClick, animationClass, onAnimationEnd, isSuspended }) => {
  const navigate = useNavigate();

  function getWeekendTitle(workSchedule) {
    if (!workSchedule) return;
    if (workSchedule.saturday && workSchedule.sunday) return 'Vikendom';
    if (workSchedule.saturday && !workSchedule.sunday) return 'Subotom';
    if (!workSchedule.saturday && workSchedule.sunday) return 'Nedeljom';
    return 'Vikendom';
  }

  function getWeekendTime(workSchedule) {
    if (!workSchedule) return;
    if (workSchedule.saturday || workSchedule.sunday) {
      return (workSchedule.weekendStart.slice(0, 5) + ' - ' + workSchedule.weekendEnd.slice(0, 5) + 'h');
    } else {
      return 'Zatvoreno';
    }
  }

  function isOpenFunction(workSchedule) {
    if (!workSchedule) return;
    const now = new Date();
    const day = now.getDay();
    const hours = Number(now.getHours());
    const minutes = Number(now.getMinutes());
    const totalNow = hours * 60 + minutes;

    if (day < 6 && day > 0) {
      const start = Number(workSchedule.workDayStart.slice(0, 2)) * 60 + Number(workSchedule.workDayStart.slice(3, 5));
      const end = Number(workSchedule.workDayEnd.slice(0, 2)) * 60 + Number(workSchedule.workDayEnd.slice(3, 5));
      if (start < end) {
        if (start <= totalNow && totalNow < end) return true;
      } else {
        if (start <= totalNow || totalNow < end) return true;
      }
    } else {
      const start = Number(workSchedule.weekendStart.slice(0, 2)) * 60 + Number(workSchedule.weekendStart.slice(3, 5));
      const end = Number(workSchedule.weekendEnd.slice(0, 2)) * 60 + Number(workSchedule.weekendEnd.slice(3, 5));
      if (day === 6 && workSchedule.saturday) {
        if (start < end ? (start <= totalNow && totalNow < end) : (start <= totalNow || totalNow < end)) return true;
      }
      if (day === 0 && workSchedule.sunday) {
        if (start < end ? (start <= totalNow && totalNow < end) : (start <= totalNow || totalNow < end)) return true;
      }
    }
    return false;
  }

  return (
    <div
      onClick={e => (!isForOwner && handleCardClick(restaurant.id))} onAnimationEnd={onAnimationEnd}
      className={`restaurant-card ${!isForOwner ? "restaurant-card-search-specific" : ""} ${animationClass || ""}`}
      style={{
        pointerEvents: animationClass ? "none" : "auto"
      }}
    >
      <section className="section-row">
        <img
          src={restaurant.image || "https://fastly.picsum.photos/id/635/450/300.jpg?hmac=uihVhPLLXIWpSq1VatqfJ0Q1CuPP-2CQG54M43Da6do"}
          alt={restaurant.name}
        />
        <section>
          <h4>Radnim danima</h4>
          <p>{restaurant.baseWorkSched.workDayStart.slice(0, 5) + " - " + restaurant.baseWorkSched.workDayEnd.slice(0, 5)}h</p>
          <h4>{getWeekendTitle(restaurant.baseWorkSched)}</h4>
          <p>{getWeekendTime(restaurant.baseWorkSched)}</p>
        </section>
      </section>
      <h3 className="restaurant-name">
        {restaurant.name}{!isOpenFunction(restaurant.baseWorkSched) || isSuspended && <span style={{ color: "darkred" }}> - Closed</span>}
      </h3>
      <section className="section-row r-card-contact-row" style={{ textDecoration: "underline" }}>
        <p className="address">📍Adresa: {restaurant.address.streetAndNumber + ", " + restaurant.address.city}</p>
        <p className="phone">☎️Telefon: {restaurant.phoneNumber}</p>
      </section>
      <p className="card-desc">{restaurant.description}</p>

      {isForOwner && (
        <section className="section-row button-group">
          <button onClick={(e) => { e.stopPropagation(); navigate("/owner/restaurants/" + restaurant.id); }}>Pristupi</button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(restaurant.id); }}>Ukloni</button>
        </section>
      )}
    </div>
  );
};

export default RestaurantCard;
