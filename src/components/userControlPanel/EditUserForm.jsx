import FileUploader from "./FileUploader";
import React from "react";

export default function EditUserForm({
  user,
  active,
  handleSubmit,
  handleInputChange,
  setProfilePictureFile
}) {
  return (
    <section id="izmeni-podatke-form" className={active}>
      {!user ? (
        <p>Učitavanje forme...</p>
      ) : (
        <form id="edit-user-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="firstName">Ime:</label>
            <input
              type="text"
              id="firstName"
              value={user.firstName || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="lastName">Prezime:</label>
            <input
              type="text"
              id="lastName"
              value={user.lastName || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={user.email || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="upload-section">
          <FileUploader onFileSelected={setProfilePictureFile} />
          </div>
          <button id="save" type="submit">
            Sačuvaj
          </button>
        </form>
      )}
    </section>
  );
}
