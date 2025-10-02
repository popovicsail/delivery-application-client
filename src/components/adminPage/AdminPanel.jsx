import React from "react";
import "../../styles/main.scss";
import { useNavigate } from "react-router-dom";

const UsersTable = ({ users, onDelete }) => {
  const navigate = useNavigate();

  return (
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
            <td>
              <button onClick={() => onDelete(user.id)}>Izbriši</button>
              <button onClick={() => navigate(`/edit-user/${user.id}`)}>Izmeni</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;