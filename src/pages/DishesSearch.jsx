import React, { useState, useEffect, useRef } from "react";
import { dishService } from "../services/dishes.services.jsx"
import DishCard from "../components/dishes/DishCard.jsx";
import "../styles/main.scss";

const DishesSearch = () => {
  const [dishes, setDishes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("NAME_ASC"); //NAME_ASC, NAME_DESC, TYPE_ASC, TYPE_DESC, PRICE_ASC, PRICE_DESC
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
    type: '',
    minPrice: '',
    maxPrice: '',
    allergicOnAlso: true
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
      ...prev, name: '', type: '', minPrice: '', allergicOnAlso: true
    })));
    setSort("NAME_ASC");
  }

  const loadDishes = async () => {
    try {
      setLoading(true);
      const data = await dishService.getPaged(sort, filters, page);
      setDishes(data.items || []);
      setPagination({
        count: data.count,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        hasPreviousPage: data.hasPreviousPage,
        hasNextPage: data.hasNextPage,
      });

      setError("");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError("Niste uneli validne podatke.");
        } else if (error.response.status === 404) {
          setError("Pogresna ruta.");
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
    loadDishes();
  }, [page]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      setFilters(prev => ({ ...prev, allergicOnAlso: true }));
    }
  }, []);

  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  return(
    <div id="dishes-search-container">
      <div id="filter-container" >
        <div id="filter-box">
          <h4>Filteri</h4>
          <section className="section-row">
            <label>Naziv:</label>
            <input type="text" name="name" value={filters.name} onChange={handleFilterChange} />
          </section>
          <section className="section-row" id="tip">
            <label>Tip:</label>
            <input type="text" name="type" value={filters.type} onChange={handleFilterChange} />
          </section>
          <section className="section-row">
            <label>Min. Cena:</label>
            <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} />
          </section>
          <section className="section-row">
            <label>Max. Cena:</label>
            <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} />
          </section>
          <section className="section-row">
            <label>Prikazi i one na koje ste alergicni?</label>
            <input type="checkbox" checked={(filters.allergicOnAlso == "false") || (filters.allergicOnAlso == false) ? false : true} name="allergicOnAlso" onChange={handleFilterChange} />
          </section>
          <h4>Sortiraj</h4>
          <select value={sort} onChange={e => setSort(e.target.value)} name="sortSelect">
            <option value="NAME_ASC">Naziv Rastuce</option>
            <option value="NAME_DESC">Naziv Opadajuce</option>
            <option value="TYPE_ASC">Tip Rastuce</option>
            <option value="TYPE_DESC">Tip Opadajuce</option>
            <option value="PRICE_ASC">Cena Rastuce</option>
            <option value="PRICE_DESC">Cena Opadajuce</option>
          </select>
          <section className="section-row">
            <button className="buttons-form" type="submit" onClick={loadDishes}>Primeni</button>
            <button className="buttons-form" type="reset" onClick={resetFilters}>Resetuj</button>
          </section>
        </div>
      </div>
      <div id="cards-container">
        {dishes.map((d) => (
          <DishCard key={d.id} isInMenu={false} isOwnerHere={false} dish={d}></DishCard>
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
            onClick={e => {setPage(Number(pagination.totalPages))}}></div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default DishesSearch;