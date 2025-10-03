import React, { useState, useEffect } from "react";
import "../../styles/userControlPanel.scss";
import UsersControlPanel from "./UserControlPanel.jsx";


export default function ProfilePage() {
    const [users, setUsers] = useState([
        { id: 1, username: "user1", role: "admin", registrationDate: "2023-01-01" },
        { id: 2, username: "user2", role: "user", registrationDate: "2023-02-15" },
        { id: 3, username: "user3", role: "user", registrationDate: "2023-03-10" },
    ]);
    const [error, setError] = useState(null);

    const onDelete = (userId) => {
        setUsers(users.filter(user => user.id !== userId));
    }


    return (
        <div>
            {error && <p className="error">{error}</p>}
            <UsersControlPanel/>
        </div>
    );
}