import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/main.scss";

const RestaurantCard = ({ restaurant, handleDelete, isForOwner, handleCardClick, isSuspended }) => {
  const navigate = useNavigate();

  function getWeekendTitle(workSchedule) {
    if (workSchedule.saturday && workSchedule.sunday) {
      return 'Vikendom';
    } else if (workSchedule.saturday && !workSchedule.sunday) {
      return 'Subotom';
    } else if (!workSchedule.saturday && workSchedule.sunday) {
      return 'Nedeljom';
    } else {
      return 'Vikendom';
    }
  }

  function getWeekendTime(workSchedule) {
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
      const startHours = Number(workSchedule.workDayStart.slice(0, 2));
      const startMinutes = Number(workSchedule.workDayStart.slice(3, 5));
      const start = startHours * 60 + startMinutes;

      const endHours = Number(workSchedule.workDayEnd.slice(0, 2));
      const endMinutes = Number(workSchedule.workDayEnd.slice(3, 5));
      const end = endHours * 60 + endMinutes;

      if (start < end) {
        if (start <= totalNow && totalNow < end) return true;
      } else {
        if (start <= totalNow || totalNow < end) return true;
      }
    } else {
      const startHours = Number(workSchedule.weekendStart.slice(0, 2));
      const startMinutes = Number(workSchedule.weekendStart.slice(3, 5));
      const start = startHours * 60 + startMinutes;

      const endHours = Number(workSchedule.weekendEnd.slice(0, 2));
      const endMinutes = Number(workSchedule.weekendEnd.slice(3, 5));
      const end = endHours * 60 + endMinutes;

      if (day == 6) {
        if (workSchedule.saturday) {
          if (start < end) {
            if (start <= totalNow && totalNow < end) return true;
          } else {
            if (start <= totalNow || totalNow < end) return true;
          }
        }
      }
      if (day == 0) {
        if (workSchedule.sunday) {
          if (start < end) {
            if (start <= totalNow && totalNow < end) return true;
          } else {
            if (start <= totalNow || totalNow < end) return true;
          }
        }
      }
    }
    return false;
  }

  return(
    <div onClick={e => (!isForOwner && handleCardClick(restaurant.id))} className={!isForOwner ? "restaurant-card restaurant-card-search-specific" : "restaurant-card"}>
        <section className="section-row">
            <img src={restaurant.image || "https://fastly.picsum.photos/id/635/450/300.jpg?hmac=uihVhPLLXIWpSq1VatqfJ0Q1CuPP-2CQG54M43Da6do"} alt={restaurant.name}/>
            <section>
                <h4>Radnim danima</h4>
                <p>{restaurant.baseWorkSched.workDayStart.slice(0, 5) + " - " + restaurant.baseWorkSched.workDayEnd.slice(0, 5)}h</p>
                <h4>{getWeekendTitle(restaurant.baseWorkSched)}</h4>
                <p>{getWeekendTime(restaurant.baseWorkSched)}</p>
            </section>
        </section>
        <h3 className="restaurant-name">{restaurant.name}{!isOpenFunction(restaurant.baseWorkSched) || isSuspended && <span style={{color: "darkred"}}> - Closed</span>}</h3>
        <section className="section-row r-card-contact-row" style={{textDecoration: "underline"}}>
            <p className="address">📍Adresa: {restaurant.address.streetAndNumber + ", " + restaurant.address.city}</p>
            <p className="phone">☎️Telefon: {restaurant.phoneNumber}</p>
        </section>
        <p className="card-desc">{restaurant.description}</p>
        {isForOwner && <section className="section-row button-group">
            <button onClick={() => navigate("/owner/restaurants/" + restaurant.id)}>Pristupi</button>
            <button onClick={() => handleDelete(restaurant.id)}>Ukloni</button>
        </section>}
    </div>
  );
}

export default RestaurantCard;