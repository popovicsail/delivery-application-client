import React from "react";

export default function ProfileView({ profile, active }) {
    return (
      <section id="profil-view" className={active}>
        {!profile ? (
          <p>Učitavanje profila...</p>
        ) : (
          <>
            <div className="profile-picture">
              <img src={profile?.imageUrl || "/default-avatar.png"} alt="Profilna slika" />
            </div>
            <p><strong>Korisničko ime:</strong> <span>{profile.userName}</span></p>
            <p><strong>Ime:</strong> <span>{profile.firstName}</span></p>
            <p><strong>Prezime:</strong> <span>{profile.lastName}</span></p>
            <p><strong>Email:</strong> <span>{profile.email}</span></p>
            <p><strong>Uloga:</strong> <span>{profile.roles?.join(", ")}</span></p>
            {profile.roles?.includes("Courier") && (
            <p>
              <strong>Status kurira:</strong>{" "}
              <span>
                {profile.status === "AKTIVAN"
                  ? "🟢 Aktivan"
                  : "⚪ Neaktivan"}
              </span>
            </p>
          )}
          </>
        )}
      </section>
    );
  }
  