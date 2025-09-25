import React, { useState, useEffect } from "react";
import UsersTable from "./AdminPanel.jsx";


export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);


    return (
        <div>
            <h2>Korisnici koji su registrovani</h2>
            {error && <p className="error">{error}</p>}
            <UsersTable />
        </div>
    );
}