import React, { useEffect, useState } from "react";
import * as userService from "../../services/user.services.jsx";
import "../../styles/adminPanel.scss";
import { Link } from "react-router-dom";

export default function UsersAdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // učitavanje korisnika
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Greška pri učitavanju korisnika:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id); // pretpostavljam da imaš endpoint
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Greška pri brisanju korisnika:", err);
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
        <p>Učitavanje...</p>
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