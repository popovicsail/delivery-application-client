import React, { useState, useEffect } from "react";
import DishMiniCard from "../dishes/DishMiniCard";
import "../../styles/offers.scss";

const DishSelectorPanel = ({dishes, addDishToItems, setSort, setFilters, filters, sort}) => {
  const [localFilters, setLocalFilters] = useState({
    name: filters ? filters.name : '',
    type: filters ? filters.type : '',
  });

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setFilters((prev) => ({ ...prev, name: localFilters.name, type: localFilters.type }))
    }
  }

  const resetFilters = () => {
    setFilters((prev => ({
      ...prev, name: '', type: '',
    })));
    setSort("NAME_ASC");
  }

  return (
    <div className="dish-selector-panel-container">
      <h2>Odabir Jela za Ponudu</h2>

      <div className="filter-block">
        <div className="filter-row">
          <div>
            <label>Naziv</label>
            <input type="text" value={localFilters && localFilters.name} onKeyDown={handleKeyDown} onChange={(e) => setLocalFilters((prev) => ({ ...prev, name: e.target.value }))}/>
          </div>
          <div>
            <label>Tip</label>
            <input type="text" value={localFilters && localFilters.type} onKeyDown={handleKeyDown} onChange={(e) => setLocalFilters((prev) => ({ ...prev, type: e.target.value }))}/>
          </div>
          <div>
            <label>Sortiraj po</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="NAME_ASC">Naziv Rastuće</option>
              <option value="NAME_DESC">Naziv Opadajuće</option>
              <option value="TYPE_ASC">Tip Rastuće</option>
              <option value="TYPE_DESC">Tip Opadajuće</option>
            </select>
          </div>
        </div>
        <button type="button" onClick={resetFilters}>Resetuj</button>
      </div>

      <div className="dishes-list">
        {dishes && dishes.length === 0 && <p>Nema dostupnih jela za odabir.</p>}
        {dishes?.map((dish) => (
          <DishMiniCard key={dish.id} dish={dish} onAdd={addDishToItems}/>
        ))}
      </div>
    </div>
  );
}

export default DishSelectorPanel;