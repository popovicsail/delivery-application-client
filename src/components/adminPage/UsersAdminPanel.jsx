import React, { useEffect, useState } from "react";
import * as userService from "../../services/user.services.jsx";
import "../../styles/adminPanel.scss";
import { Link } from "react-router-dom";

export default function UsersAdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // učitavanje korisnika
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getAllUsers();
        setUsers(data);
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
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Da li ste sigurni da zelite da izbrisete korisnika?")) {
        return;
      }
      setLoading(true);
      await userService.deleteUser(id); // pretpostavljam da imaš endpoint
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError("Ne postoji korisnik sa ovim id-em.");
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

  return (
    <div className="users-admin-panel">
      <h2 className="naslov">Korisnici koji su registrovani</h2>
      <div className="form-actions">
        <Link to="/adminCreate" className="btn-primary">
          Dodaj novog korisnika
        </Link>
      </div>

      {loading ? (
       <div id="loadingSpinner" className="spinner"></div>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Korisničko ime</th>
              <th>Email</th>
              <th>Ime i prezime</th>
              <th>Role</th>
              <th>Akcija</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) &&
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.userName}</td>
                  <td>{user.email}</td>
                  <td>{`${user.firstName} ${user.lastName}`}</td>
                  <td>{user.roles?.join(", ")}</td>
                  <td className="delete-column">
                    <button onClick={() => handleDelete(user.id)}>Izbriši</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}