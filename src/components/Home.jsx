import React, { useEffect, useState } from "react";
import "../styles/main.scss"
import RestaurantCard from "./RestaurantCard";
import useCardSlider from "./useCardSlider";
import { dishService } from "../services/dishes.services";
import { getMostDiscounts, getTopRated, getMostOftenOrderedFromByCustomer, getMostRecentOrderedFromByCustomer } from "../services/restaurant.services";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [mostOften, setMostOften] = useState([]);
  const [mostRecent, setMostRecent] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [mostDiscounts, setMostDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const myProfile = JSON.parse(sessionStorage.getItem('myProfile'))
  const roles = myProfile?.roles || [];

  const oftenSlider = useCardSlider(mostOften.length);
  const recentSlider = useCardSlider(mostRecent.length);

  const loadMostOften = async () => {
    try {
      setLoading(true);
      const data = await getMostOftenOrderedFromByCustomer();
      setMostOften(data || []);
      setError('');
    } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
          setError('Ova ruta ne postoji.');
          } else if (error.response.status === 401) {
          setError('Ova ruta je rezervisana samo za kupce.');
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

  const loadMostRecent = async () => {
    try {
      setLoading(true);
      const data = await getMostRecentOrderedFromByCustomer();
      setMostRecent(data || []);
      setError('');
    } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
          setError('Ova ruta ne postoji.');
          } else if (error.response.status === 401) {
          setError('Ova ruta je rezervisana samo za kupce.');
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

  const loadTopRated = async () => {
    try {
      setLoading(true);
      const data = await getTopRated();
      setTopRated(data || []);
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

  const loadMostDiscounts = async () => {
    try {
      setLoading(true);
      const data = await getMostDiscounts();
      setMostDiscounts(data || []);
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

  useEffect(() => {
    loadMostDiscounts();
    loadMostOften();
    loadTopRated();
    loadMostRecent();
  }, []);
  
  const handleCardClick = async (id) => {
    try {
      setLoading(true);
      const menu = await dishService.getRestaurantMenu(id);
      navigate(`/menu/${menu.id}`);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError('Ne postoji restoran sa ovim id-em.');
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

  return (
    <div id="home-container">
      <div className="intro-block">
        <div className="wrapper">
          <p style={{fontSize: '1.8rem'}}>Poručite hranu iz restorana po Vašem izboru!</p>
          <p>Za Vas smo istakli restorane u nekoliko najzanimljivijih kategorija.</p>
          <p>Posetite, Poručite I Ocenite ih, kako bi i Vama i ostalima ulepšali iskustvo.</p>
        </div>
      </div>
      <div className="for-customer-block">
        <div className="wrapper">
          <div className="wrapper">
            
            <p className="for-customer-p-one">Vaši odabrani restorani.</p>
            <p className="for-customer-p-two">Ovo su restorani iz kojih ste najčešće i najskorije poručivali.</p>
          </div>
        </div>

        <div className="for-customer-restaurants-block">
          <div className="most-often-block">
            <h3>Najčešće poručivali iz:</h3>
            {roles.includes('Customer')
            ? mostRecent.length > 0 ? 
              <div className="most-often-row">
                <div className="wrapper">
                  <button className="left-slider" onClick={oftenSlider.goLeft} />
                </div>
                {mostOften[oftenSlider.index] && <RestaurantCard restaurant={mostOften[oftenSlider.index]} isForOwner={false} 
                handleCardClick={handleCardClick} animationClass={oftenSlider.animationClass}
                onAnimationEnd={oftenSlider.onAnimationEnd}/>}
                <div className="wrapper">
                  <button className="right-slider" onClick={oftenSlider.goRight} />
                </div>
              </div> 
              : <p>Niste do sada poručivali ni iz jednog restorana.</p>
              : <p>Ulogujte se kao kupac da biste dobili personalizovane preporuke</p>
              }
          </div>

          <div className="most-recent-block">
            <h3>Najskorije poručivali iz:</h3>
            {roles.includes('Customer')
            ? mostRecent.length > 0 ? 
            <div className="most-recent-row">
              <div className="wrapper">
                <button className="left-slider" onClick={recentSlider.goLeft} />
              </div>
              {mostRecent[recentSlider.index] && <RestaurantCard restaurant={mostRecent[recentSlider.index]} isForOwner={false} handleCardClick={handleCardClick}
              animationClass={recentSlider.animationClass}
              onAnimationEnd={recentSlider.onAnimationEnd}/>}
              <div className="wrapper">
                <button className="right-slider" onClick={recentSlider.goRight} />
              </div>
            </div>
            : <p>Niste do sada poručivali ni iz jednog restorana.</p>
            : <p>Ulogujte se kao kupac da biste dobili personalizovane preporuke</p>
            }
          </div>
        </div>
      </div>
      <div className="top-rated-block">
        <div className="p-wrapper">
          <p className="top-rated-p">Ukoliko su vam <strong>KVALITET</strong> i <strong>SIGURNOST</strong> odluke na <strong>1.</strong> mestu, 
          <br />Ovo su <strong>3</strong> Najbolje Ocenjena Restorana.</p>
        </div>
        <div className="restaurants-wrapper">
          {topRated.length > 0 ? topRated.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} isForOwner={false} handleCardClick={handleCardClick} />
          ))
          : <p>Nema rezultata</p>
          }
        </div>
      </div>

      <div className="most-discounts-block">
        <div className="p-wrapper">
          <p className="most-discounts-p">Ako je <strong>PRISTUPACNOST</strong> u ceni ono što Vas najviše zanima,
          <br />Ovde možete videti restorane koji nude najveći asortiman <strong>AKCIJA</strong>.</p>
        </div>
        <div className="restaurants-wrapper">
          {mostDiscounts.length > 0 ? mostDiscounts.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} isForOwner={false} handleCardClick={handleCardClick} />
          ))
          : <p>Nema rezultata</p>
          }
        </div>
      </div>
    </div>
  );
}

export default Home;