import React, { useEffect, useState } from "react";
import "../../styles/main.scss";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../services/user.services.jsx";

export const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Greška pri učitavanju korisnika:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    // Dodaj logiku za brisanje ako imaš endpoint
    console.log("Brisanje korisnika:", id);
  };

  return (
    <div>
      <button className="createButton" onClick={() => navigate("/adminCreate")}>
        Kreiraj novog korisnika
      </button>

      <h2 className="naslov">Korisnici koji su registrovani</h2>

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
            {Array.isArray(users) && users.map((user) => (
              <tr key={user.id}>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                <td>{user.roles}</td>
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
};

export default UsersTable;
