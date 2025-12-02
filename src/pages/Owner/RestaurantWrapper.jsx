import React, { useState, useEffect } from "react";
import "../../styles/main.scss";
import RestaurantOverview from "../RestaurantOverview";
import RestaurantMenuOwner from "./RestaurantMenuOwner";
import RestaurantOffers from "./RestaurantOffers";
import RestaurantWorkers from "./RestaurantWorkers";
import RestaurantForm from "./RestaurantForm";
import RestaurantStatistics from "./RestaurantStatistics";
import { useLocation, useParams } from "react-router-dom";
import { getRestaurantPermissionAsync } from "../../services/user.services"
import { getOneRestaurant } from "../../services/restaurant.services";

const RestaurantWrapper = () => {
  const location = useLocation();
  const { navigateTab } = location.state || {};
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [permitted, setPermitted] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const { restaurantId } = useParams();

  const askForPermission = async () => {
    try {
      setLoading(true);
      const response = await getRestaurantPermissionAsync(restaurantId);
      setPermitted(response);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError("Restoran sa ovim id-em ne postoji ili pogresna ruta.");
        } else if (error.response.status === 401) {
          setError("Ova ruta je rezervisana samo za vlasnika ovog restorana.");
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
      console.error("Greška pri slanju zahteva za permisije:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurantId) {
      const fetchAndSet = async () => {
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

      fetchAndSet();
    } else {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    askForPermission();
  }, []);

  useEffect(() => {
    if (navigateTab) {
      setActiveTab(navigateTab);
    }
  }, [navigateTab]);

  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!permitted) return <p style={{ color: 'red' }}>Nemate dozvolu da pristupite ovoj stranici.</p>;
  return (
    <div id="restaurant-wrapper">
      <div className="owner-drawer-block">

        <div className="owner-drawer-title-wrapper">
          <p className="owner-drawer-title" title={restaurant && restaurant.name}>{restaurant && restaurant.name}</p>
        </div>

        <div className="owner-drawer-option" id={`${activeTab == "overview" && "owner-drawer-option-active"}`}
        onClick={(e) => setActiveTab("overview")}>🔎 Pregled</div>
        <div className="owner-drawer-option" id={`${activeTab == "menu" && "owner-drawer-option-active"}`}
        onClick={(e) => setActiveTab("menu")}> 🍴 Menu</div>
        <div className="owner-drawer-option" id={`${activeTab == "offers" && "owner-drawer-option-active"}`}
        onClick={(e) => setActiveTab("offers")}>📣 Ponude</div>
        <div className="owner-drawer-option" id={`${activeTab == "workers" && "owner-drawer-option-active"}`}
        onClick={(e) => setActiveTab("workers")}>👥 Radnici</div>
        <div className="owner-drawer-option" id={`${activeTab == "statistics" && "owner-drawer-option-active"}`}
        onClick={(e) => setActiveTab("statistics")}>📈 Statistika</div>
        <div className="owner-drawer-option" id={`${activeTab == "settings" && "owner-drawer-option-active"}`}
        onClick={(e) => setActiveTab("settings")}>⚙️ Podesavanja</div>
      </div>

      <div className="owner-content-container">
        {activeTab == "overview" && (<RestaurantOverview isOwner={true}/>)}
        {activeTab == "menu" && (<RestaurantMenuOwner restaurantId={restaurantId}/>)}
        {activeTab == "offers" && (<RestaurantOffers restaurantId={restaurantId}/>)}
        {activeTab == "workers" && (<RestaurantWorkers restaurantId={restaurantId}/>)}
        {activeTab == "statistics" && (<RestaurantStatistics restaurantId={restaurantId}/>)}
        {activeTab == "settings" && (<RestaurantForm restaurantId={restaurantId} setActiveTab={setActiveTab}/>)}
      </div>
    </div>
  );
}
export default RestaurantWrapper;