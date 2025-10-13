import React from "react";



export default function AllergenView({ alergens = [], toggleAlergen, handleSubmitAlergens, active }) {
    return (
      <section id="alergen-view" className={active}>
        <div className="form-section">
          <h3>🧬 Alergeni</h3>
          <form className="alergenForm" onSubmit={handleSubmitAlergens}>
            <div className="alergen-list">
              {alergens.length === 0 ? (
                <p>Nema dostupnih alergena.</p>
              ) : (
                alergens.map((a) => (
                  <label key={a.id} className={`checkbox-label ${a.selected ? "selected" : ""}`}>
                    <input
                      type="checkbox"
                      checked={a.selected}
                      onChange={() => toggleAlergen(a.id)}
                    />
                    {a.name} <span className="allergen-type">({a.type})</span>
                  </label>
                ))
              )}
            </div>
            <div className="dugme">
              <button type="submit">Sačuvaj alergene</button>
            </div>
          </form>
        </div>
      </section>
    );
  }
  
  