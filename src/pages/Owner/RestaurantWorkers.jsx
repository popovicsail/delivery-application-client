import React, { useState, useEffect } from "react";
import { getMyWorkers, getMyRestaurants, suspendWorker, unsuspendWorker } from "../../services/restaurant.services.jsx"
import "../../styles/main.scss";
import WorkerCard from "../../components/WorkerCard.jsx"; 
import WorkerForm from "../../components/WorkerForm.jsx"
import props from "../../props/pp.png"

const RestaurantWorkers = ( {restaurantId} ) => {
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [component, setComponent] = useState("workers");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

    const loadWorkers = async () => {
      try {
        setLoading(true);
        const data = await getMyWorkers(restaurantId);
        setWorkers((prev) => (data && data.length > 0 ? data : []));
        setError('');
      } catch (error) {
         if (error.response) {
          if (error.response.status === 404) {
            setError('Vlasnik sa ovim id-em ne postoji ili ova ruta ne postoji.');
          } else if (error.response.status === 401) {
            setError('Ova stranica je rezervisana samo za vlasnike restorana.');
            } else if (error.response.status === 500) {
            setError('Greska na serveru. Pokusajte kasnije.');
          } else {
            setError(`Greska: ${error.response.status}`);
          }
        } else if (error.request) {
          setError('Nema odgovora sa servera.');
        } else {
          setError('Doslo je do greske.');
        }
        console.error('Greska:', error.message);
      } finally {
        setLoading(false);
      }
    };
  
    const handleSuspend = async (id, name) => {
      if (!window.confirm(`Da li ste sigurni da zelite da suspenzujete radnika: ${name}?`)) {
        return;
      }
      try {
        setLoading(true);
        const response = await suspendWorker(id);
        setError('');
        setRefreshKey((prev) => prev + 1);
        alert(`Uspesno ste suspendovali radnika: ${name}`);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            setError('Ne postoji radnik sa ovim id-em.');
          } else if (error.response.status === 500) {
            setError('Greska na serveru. Pokusajte kasnije.');
          } else {
            setError(`Greska: ${error.response.status}`);
          }
        } else if (error.request) {
          setError('Nema odgovora sa servera.');
        } else {
          setError('Doslo je do greske.');
        }
        console.error('Greska:', error.message);
      } finally {
        setLoading(false);
      }
    };

    const handleUnsuspend = async (id, name) => {
      if (!window.confirm(`Da li ste sigurni da zelite da skinete suspenziju radnika: ${name}?`)) {
        return;
      }
      try {
        setLoading(true);
        const response = await unsuspendWorker(id);
        setError('');
        setRefreshKey((prev) => prev + 1);
        alert(`Uspesno ste skinuli suspenziju radnika: ${name}`);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            setError('Ne postoji radnik sa ovim id-em.');
          } else if (error.response.status === 500) {
            setError('Greska na serveru. Pokusajte kasnije.');
          } else {
            setError(`Greska: ${error.response.status}`);
          }
        } else if (error.request) {
          setError('Nema odgovora sa servera.');
        } else {
          setError('Doslo je do greske.');
        }
        console.error('Greska:', error.message);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (restaurantId) {
        loadWorkers();
      }
    }, [refreshKey, restaurantId]);


  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  return(
    <div id="workers-owner-container">

      <div className="restaurant-header">
        <h1>Radnici Restorana</h1>

        <div className="owner-restaurant-create-btn-wrapper">
          <button className="buttons create-btn" onClick={() => setComponent("register")} style={{justifySelf: 'end'}}>+ Registruj radnika</button>
        </div> 
      </div>

       
      <div id="worker-cards-container">
        {workers.length === 0 && <p>Trenutno nema registrovanih radnika za ovaj restoran.</p>}
        {workers.map((w) => (
          <WorkerCard key={w.id} isOwnerHere={true} handleSuspend={handleSuspend} handleUnsuspend={handleUnsuspend} worker={w} setSelectedWorker={setSelectedWorker} setComponent={setComponent}></WorkerCard>
        ))}
      </div>
      {component == "register" && (
      <WorkerForm setComponent={setComponent} component={component} worker={null} setRefreshKey={setRefreshKey}></WorkerForm>
      )}
      {component == "edit" && (
      <WorkerForm setComponent={setComponent} component={component} worker={selectedWorker} setRefreshKey={setRefreshKey}></WorkerForm>
      )}
    </div>
  );
}

export default RestaurantWorkers;