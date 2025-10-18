import React from "react";

export default function AllergenView({ alergens = [], toggleAlergen, handleSubmitAlergens, active }) {
  const roles = sessionStorage.getItem("roles");
   if (!roles || !roles.includes("Customer")) {
      return (
        <section id="alergen-view" className={active}>
          <p>Alergeni ne mogu biti ucitani bez uloge Customer-a!</p>
        </section>
      )
    };
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
                <label
                  key={a.id}
                  className={`checkbox-label ${a.selected ? "selected" : ""}`}
                >
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
