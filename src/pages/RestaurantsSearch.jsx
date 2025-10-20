import React, { useState, useEffect, useRef } from "react";
import { getPagedRestaurants } from "../services/restaurant.services.jsx"
import RestaurantCard from "../components/RestaurantCard.jsx";
import "../styles/main.scss";

const RestaurantsSearch = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState(0);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    count: 0,
    currentPage: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  })
  const [filters, setFilters] = useState({
    name: '',
    city: '',
    openingTime: '',
    closingTime: '',
    closedToo: true
  });
  const firstRender = useRef(true);

  const handleFilterChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  function resetFilters() {
    setFilters((prev => ({
      ...prev, name: '', city: '', openingTime: '', closingTime: '', closedToo: true
    })));
    setSort(0);
  }

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const data = await getPagedRestaurants(sort, filters, page);
      setRestaurants(data.items || []);
      setPagination({
        count: data.count,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        hasPreviousPage: data.hasPreviousPage,
        hasNextPage: data.hasNextPage
      })
      
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError('Greska pri ucitavanju restorana.');
    }
    setLoading(false);
  };
  
  useEffect(() => {
    loadRestaurants();
  }, [page]);

  useEffect(() => {
  if (firstRender.current) {
    firstRender.current = false;
    setFilters(prev => ({ ...prev, closedToo: true }));
  }
}, []);

  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  return(
    <div id="restaurants-search-container">
      <div id="filter-container" >
        <div id="filter-box">
          <h4>Filteri</h4>
          <section className="section-row">
            <label>Naziv:</label>
            <input type="text" name="name" value={filters.name} onChange={handleFilterChange} />
          </section>
          <section className="section-row">
            <label>Grad:</label>
            <input type="text" name="city" value={filters.city} onChange={handleFilterChange} />
          </section>
          <h5>Radi u vreme:</h5>
          <section className="section-row time-specific-section-row">
            <label>Od:</label>
            <input type="time" name="openingTime" value={filters.openingTime} onChange={handleFilterChange} />
          </section>
          <section className="section-row time-specific-section-row">
            <label>Do:</label>
            <input type="time" name="closingTime" value={filters.closingTime} onChange={handleFilterChange} />
          </section>
          <section className="section-row time-specific-section-row">
            <label>Prikazi i zatvorene?</label>
            <input type="checkbox" checked={(filters.closedToo == "false") || (filters.closedToo == false) ? false : true} name="closedToo" onChange={handleFilterChange} />
          </section>
          <h4>Sortiraj</h4>
          <select value={sort} onChange={e => setSort(Number(e.target.value))} name="sortSelect">
            <option value="0">Naziv Rastuce</option>
            <option value="1">Naziv Opadajuce</option>
          </select>
          <section className="section-row">
            <button className="buttons-form" type="submit" onClick={loadRestaurants}>Primeni</button>
            <button className="buttons-form" type="reset" onClick={resetFilters}>Resetuj</button>
          </section>
        </div>
      </div>
      <div id="cards-container">
        {restaurants.map((r) => (
          <RestaurantCard key={r.id} isForOwner={false} restaurant={r}></RestaurantCard>
        ))}
        <div id="buttons-row">
          <div id="buttons-box">
            <div className={(Number(pagination.currentPage) > 2) ? "circle-buttons" : "circle-buttons hidden"} 
            onClick={e => {(Number(pagination.currentPage) > 2) && (setPage(1))}}></div>
            <div className={!pagination.hasPreviousPage ? "circle-buttons hidden" : "circle-buttons"} 
            onClick={e => {pagination.hasPreviousPage && (setPage(page - 1))}}></div>
            <div id="center-button"></div>
            <div className={!pagination.hasNextPage ? "circle-buttons hidden" : "circle-buttons"} 
            onClick={e => {pagination.hasNextPage && (setPage(page + 1))}}></div>
            <div className={(Number(pagination.totalPages) > (pagination.currentPage + 1)) ? "circle-buttons" : "circle-buttons hidden"} 
            onClick={e => {setPage(Number(pagination.totalPages) - 1)}}></div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default RestaurantsSearch;