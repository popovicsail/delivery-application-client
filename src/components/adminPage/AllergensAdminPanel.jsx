import React, { useEffect, useState } from "react";
import * as userService from "../../services/user.services.jsx";
import "../../styles/adminPanel.scss";

export default function AllergensAdminPanel() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [allergens, setAllergens] = useState([]);
  const [newAllergen, setNewAllergen] = useState({ name: "", type: "" });

  useEffect(() => {
    fetchAllergens();
  }, []);
  

  const fetchAllergens = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllergens(); // GET /allergens
      setAllergens(data);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError("Pogresna ruta.");
        } else if (error.response.status === 401) {
          setError("Ova stranica je rezervisana samo za Admine.");
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

  const handleAdd = async () => {
    if (!newAllergen.name.trim() || !newAllergen.type.trim()) return;
    try {
      setLoading(true);
      const created = await userService.createAllergen(newAllergen); // POST { name, type }
      setAllergens([...allergens, created]);
      setNewAllergen({ name: "", type: "" });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError('Niste uneli validne podatke.');
        } else if (error.response.status === 404) {
          setError("Pogresna ruta.");
        } else if (error.response.status === 401) {
          setError("Ova ruta je rezervisana samo za admine.");
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
    fetchAllergens();
  };

  const handleDelete = async (guid) => {
    try {
      if (!window.confirm("Da li ste sigurni da zelite da uklonite alergen?")) {
        return;
      }
      setLoading(true);
      await userService.deleteAllergen(guid); // DELETE /allergens/{guid}
      setAllergens(allergens.filter((a) => a.allergenGuid !== guid));
    } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            setError('Ne postoji alergen sa ovim id-em.');
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
      fetchAllergens();
  };

  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
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
