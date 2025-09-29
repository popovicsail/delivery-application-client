import React, { useState, useEffect } from "react";
import UsersTable from "./AdminPanel.jsx";
import * as userService from "../../services/user.services.tsx";


export default function AdminPage() {;
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);

    async function fetchUsers() {
        const response = await userService.getAllUsers();
        setUsers(response);
    }

    const onDelete = (userId) => {
        setUsers(users.filter(user => user.id !== userId));
    }


    return (
        <div>
            {error && <p className="error">{error}</p>}
            <UsersTable users={users} onDelete={onDelete}/>
        </div>
    );
}