import React, { useState, useEffect } from "react";
import "../styles/main.scss";
import { useNavigate, useParams } from "react-router-dom";
import { getOneRestaurant } from "../services/restaurant.services";
import { getRestaurantRatings, getAverageRating } from "../services/rating.services"

const RestaurantOverview = ({isOwner}) => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      const data = await getOneRestaurant(restaurantId);
      setRestaurant(data);
      setError("");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError("Restoran sa ovim ID-em ne postoji ili je pogresna ruta.");
        } else if (error.response.status === 401) {
          setError("Ova stranica je rezervisana samo za vlasnike restorana.");
        } else if (error.response.status === 500) {
          setError("Greska na serveru. Pokusajte kasnije.");
        } else {
          setError(`Greska: ${error.response.status}`);
        }
      } else if (error.request) {
        setError("Nema odgovora sa servera.");
      } else {
        setError("Doslo je do greske.");
      }
      console.error("Greska:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const data = await getRestaurantRatings(restaurantId);
      setRatings(data.ratings);
      setError("");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError("Restoran sa ovim ID-em ne postoji ili je pogresna ruta.");
        } else if (error.response.status === 401) {
          setError("Ova stranica je rezervisana samo za vlasnike restorana.");
        } else if (error.response.status === 500) {
          setError("Greska na serveru. Pokusajte kasnije.");
        } else {
          setError(`Greska: ${error.response.status}`);
        }
      } else if (error.request) {
        setError("Nema odgovora sa servera.");
      } else {
        setError("Doslo je do greske.");
      }
      console.error("Greska:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvgRating = async () => {
    try {
      setLoading(true);
      const data = await getAverageRating(restaurantId, 0)
      setRestaurant(prev => ({...prev, avgRating: data}));
      setError("");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError("Restoran sa ovim ID-em ne postoji ili je pogresna ruta.");
        } else if (error.response.status === 401) {
          setError("Ova stranica je rezervisana samo za vlasnike restorana.");
        } else if (error.response.status === 500) {
          setError("Greska na serveru. Pokusajte kasnije.");
        } else {
          setError(`Greska: ${error.response.status}`);
        }
      } else if (error.request) {
        setError("Nema odgovora sa servera.");
      } else {
        setError("Doslo je do greske.");
      }
      console.error("Greska:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurant();
      fetchRatings();
      fetchAvgRating();
    } else {
      setLoading(false);
    }
  }, []);

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

  return (
    <div className="restaurant-overview-page" style={!isOwner ? {margin: '1.5rem 0'} : {}}>

      <div className="restaurant-overview-container">

        {!isOwner && <div className="restaurant-left-sidebar">
          <button className="to-menu-btn" onClick={(e) => navigate('/menu/' + restaurant.menus[0].id)}>Menu</button>
        </div>}

        <div className="restaurant-overview-block">
          <div className="restaurant-overview-image-block">
            <div className="overlay"></div>
            <img src={restaurant?.image || "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/d5/bb/74/lounge.jpg?w=900&h=500&s=1"} />
            <h1>{restaurant?.name}</h1>
          </div>


          <div className="restaurant-content-block">
            <div className="restaurant-content-left-part">
              <div className="restaurant-overview-desc-wrapper">
                <h3>Opis Restorana</h3>
                <p className="restaurant-overview-desc">{restaurant?.description}</p>
              </div>
            </div>
            <div className="restaurant-content-center-part">
              <div className="restaurant-overview-work-sched">
                <h3>Radno Vreme</h3>
                <h4>Radnim danima</h4>
                <p>{restaurant?.baseWorkSched?.workDayStart.slice(0, 5) + " - " + restaurant?.baseWorkSched?.workDayEnd.slice(0, 5)}h</p>
                <h4>{getWeekendTitle(restaurant?.baseWorkSched)}</h4>
                <p>{getWeekendTime(restaurant?.baseWorkSched)}</p>
              </div>
              <div className="restaurant-overview-info-block">
                <p className="restaurant-overview-address">📍<strong>Adresa:</strong> {restaurant?.address?.streetAndNumber + ", " + restaurant?.address?.city}</p>
                <p className="restaurant-overview-phone">☎️<strong>Telefon:</strong> {restaurant?.phoneNumber}</p>
              </div>
            </div>
            <div className="restaurant-content-right-part">
              <div className="restaurant-content-reviews-block">
                <h3>Ocene kupaca</h3>
                <div className="restaurant-content-avg-rating-wrapper">
                  <p>Prosecna ocena: <strong>{restaurant?.avgRating || 'Nema'}</strong></p>
                </div>

                <div className="restaurant-overview-top-reviews">
                  <div className="restaurant-overview-review-card">
                    <div className="restaurant-overview-review-top-row">
                      <p>Od: <strong>{(ratings.length > 0) && ratings[0] ? ratings[0].user?.firstName + " " + ratings[0].user?.lastName : '-'}</strong></p>
                      <p>Ocena: <strong>{(ratings.length > 0) && ratings[0] ? ratings[0].score : '-'}</strong></p>
                    </div>
                    <p>{(ratings.length > 0) && ratings[0] && ratings[0].comment?.length > 0 ? ratings[0].comment : '-'}</p>
                  </div>
                  <div className="restaurant-overview-review-card">
                    <div className="restaurant-overview-review-top-row">
                      <p>Od: <strong>{(ratings.length > 1) && ratings[1] ? ratings[1].user?.firstName + " " + ratings[1].user?.lastName : '-'}</strong></p>
                      <p>Ocena: <strong>{(ratings.length > 1) && ratings[1] ? ratings[1].score : '-'}</strong></p>
                    </div>
                    <p>{(ratings.length > 0) && ratings[1] && ratings[0].comment?.length > 0 ? ratings[1].comment : '-'}</p>
                  </div>
                  <div className="restaurant-overview-review-card">
                    <div className="restaurant-overview-review-top-row">
                      <p>Od: <strong>{(ratings.length > 2) && ratings[2] ? ratings[2].user?.firstName + " " + ratings[2].user?.lastName : '-'}</strong></p>
                      <p>Ocena: <strong>{(ratings.length > 2) && ratings[2] ? ratings[2].score : '-'}</strong></p>
                    </div>
                    <p>{(ratings.length > 2) && ratings[2] && ratings[0].comment?.length > 0 ? ratings[2].comment : '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="restaurant-map-block">
            <div className="restaurant-map">
              <iframe
                title="restaurant-location-map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(restaurant?.address?.streetAndNumber + ', ' + restaurant?.address?.city)}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="restaurant-right-sidebar">
          <h3>Obavestenja i Neradni Dani</h3>

          <p>TBA</p>
        </div>
        
      </div>
    </div>
  );
}

export default RestaurantOverview;