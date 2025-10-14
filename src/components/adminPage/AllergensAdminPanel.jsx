import React, { useEffect, useState } from "react";
import * as userService from "../../services/user.services.tsx";

export default function AllergensAdminPanel() {
  const [allergens, setAllergens] = useState([]);
  const [newAllergen, setNewAllergen] = useState({ name: "", type: "" });

  useEffect(() => {
    fetchAllergens();
  }, []);
  

  const fetchAllergens = async () => {
    try {
      const data = await userService.getAllergens(); // GET /allergens
      setAllergens(data);
    } catch (err) {
      console.error("Greška pri učitavanju alergena:", err);
    }
  };

  const handleAdd = async () => {
    if (!newAllergen.name.trim() || !newAllergen.type.trim()) return;
    try {
      const created = await userService.createAllergen(newAllergen); // POST { name, type }
      setAllergens([...allergens, created]);
      setNewAllergen({ name: "", type: "" });
      fetchAllergens();
    } catch (err) {
      console.error("Greška pri dodavanju alergena:", err);
    }
  };

  const handleDelete = async (guid) => {
    try {
      await userService.deleteAllergen(guid); // DELETE /allergens/{guid}
      setAllergens(allergens.filter((a) => a.allergenGuid !== guid));
      fetchAllergens();
    } catch (err) {
      console.error("Greška pri brisanju alergena:", err);
    }
  };

  return (
    <div className="admin-card">
      <h2 className="card-title">Upravljanje alergenima</h2>

      <div className="form-grid">
        <div className="form-row">
          <label>Naziv</label>
          <input
            type="text"
            value={newAllergen.name}
            onChange={(e) =>
              setNewAllergen({ ...newAllergen, name: e.target.value })
            }
            placeholder="Naziv alergena"
          />
        </div>
        <div className="form-row">
          <label>Tip</label>
          <input
            type="text"
            value={newAllergen.type}
            onChange={(e) =>
              setNewAllergen({ ...newAllergen, type: e.target.value })
            }
            placeholder="Tip (npr. Voće, Žitarice...)"
          />
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-primary" onClick={handleAdd}>
          Dodaj
        </button>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>Naziv</th>
            <th>Tip</th>
            <th className="delete-column">Akcije</th>
          </tr>
        </thead>
        <tbody>
          {allergens.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.type}</td>
              <td className="delete-column">
                <button onClick={() => handleDelete(a.id)}>
                  Obriši
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
