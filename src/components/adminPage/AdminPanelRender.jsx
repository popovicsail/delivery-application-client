import React, { useState, useEffect } from "react";
import UsersTable from "./AdminPanel.jsx";
import * as userService from "../../services/user.services.tsx";

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    const onDelete = (userId) => {
        setUsers(users.filter(user => user.id !== userId));
    }


    return (
        <div>
            {error && <p className="error">{error}</p>}
            <UsersTable onDelete={onDelete}/>
        </div>
    );
}