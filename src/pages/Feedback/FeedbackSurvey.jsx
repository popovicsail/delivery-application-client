import React, { useState } from "react";
import "./../../styles/feedbackSurvey.scss";
import AdminFeedbackDashboard from "./AdminFeedback";

const questions = [
  "Kako biste ocenili jednostavnost korišćenja platforme?",
  "Kako ste zadovoljni brzinom učitavanja stranica?",
  "Kako ocenjujete dizajn i preglednost interfejsa?",
  "Koliko ste zadovoljni podrškom i dostupnim informacijama?",
];

const myProfileJson = sessionStorage.getItem("myProfile");
const myProfile = myProfileJson ? JSON.parse(myProfileJson) : null;
const user = myProfile?.user;
const roles = user?.roles || [];
console.log(roles);


export default function FeedbackSurvey() {
  const [answers, setAnswers] = useState(
    questions.map(() => ({ rating: 0, comment: "" }))
  );
  const [submitted, setSubmitted] = useState(false);

  const handleRatingChange = (index, rating) => {
    const newAnswers = [...answers];
    newAnswers[index].rating = rating;
    setAnswers(newAnswers);
  };

  const handleCommentChange = (index, comment) => {
    const newAnswers = [...answers];
    newAnswers[index].comment = comment;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answers.some((a) => a.rating === 0)) {
      alert("Molimo ocenite sva pitanja pre slanja ankete.");
      return;
    }
    console.log("Poslati odgovori:", answers);
    setSubmitted(true);
  };

  if (roles.includes = "admin") {
    return <AdminFeedbackDashboard />;
  }

  if (submitted) {
    return (
      <div className="survey-container">
        <h2>Hvala na vašim utiscima! 💬</h2>
        <p>Vaši odgovori su uspešno poslati.</p>
      </div>
    );
  }

  return (
    <form className="survey-container" onSubmit={handleSubmit}>
      <h2>📝 Utisci o platformi</h2>
      {questions.map((question, index) => (
        <div key={index} className="question-block">
          <p className="question-text">{question}</p>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${
                  star <= answers[index].rating ? "selected" : ""
                }`}
                onClick={() => handleRatingChange(index, star)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            placeholder="Ostavite komentar (opciono)"
            value={answers[index].comment}
            onChange={(e) => handleCommentChange(index, e.target.value)}
          />
        </div>
      ))}
      <button type="submit" className="submit-btn">
        Pošalji utiske
      </button>
    </form>
  );
}
