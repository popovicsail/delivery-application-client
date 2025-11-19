import React, { useState } from "react";
import { createRating } from "../../../../../services/rating.services.jsx";
import FileUploader from "../../../FileUploader.jsx";

export default function RatingForm({ orderId, targetId, targetType, onSuccess }) {
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("customerId", localStorage.getItem("customerId"));
    formData.append("targetType", targetType);
    formData.append("score", score);
    formData.append("comment", comment);

    if (targetType === "restaurant" && image) {
      formData.append("image", image);
      formData.append("targetId", localStorage.getItem("restaurantId"));
    }
    if (targetType === "courier") {
      formData.append("image", image);
      formData.append("targetId", localStorage.getItem("courierId"));
    }

    try {
      const res = await createRating(formData);
      onSuccess?.(res.ratingId);
    } catch (err) {
      console.error("Greška pri slanju ocene:", err);
      setError("Greška pri slanju ocene. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="rating-form" onSubmit={handleSubmit}>
      <h4>Oceni {targetType === "courier" ? "kurira" : "restoran"}</h4>

      <label>
        Ocena:
        <select value={score} onChange={(e) => setScore(e.target.value)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </label>

      <label>
        Komentar:
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Ostavite komentar (opciono)"
        />
      </label>

      {targetType === "restaurant" && (
        <FileUploader onFileSelected={(file) => setImage(file)} />
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Šaljem..." : "Pošalji ocenu"}
      </button>
    </form>
  );
}
