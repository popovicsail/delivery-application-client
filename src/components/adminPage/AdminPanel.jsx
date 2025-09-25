import React from "react";
import "../../styles/main.scss";
import { useNavigate } from "react-router-dom";


const UsersTable = ({ users, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div>
      <button 
      className = "createButton" 
      onClick={() => navigate("/adminCreate")}>
        Kreiraj novog korisnika
        </button>


      <h2>Korisnici koji su registrovani</h2>
    <table className="users-table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Role</th>
          <th>Datum Prijave</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.username}</td>
            <td>{user.role}</td>
            <td>{new Date(user.registrationDate).toLocaleDateString()}</td>
            <td className="delete-column">
              <button onClick={() => onDelete(user.id)}>Izbriši</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default UsersTable;