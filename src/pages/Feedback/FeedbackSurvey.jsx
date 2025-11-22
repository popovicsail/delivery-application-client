import React, { useState, useEffect } from "react";
import "./../../styles/feedbackSurvey.scss";
import AdminFeedbackDashboard from "./AdminFeedback";
import { feedbackService } from "../../services/feedbackService";

const myProfileJson = sessionStorage.getItem("myProfile");
const myProfile = myProfileJson ? JSON.parse(myProfileJson) : null;
const roles = myProfile?.roles || [];

export default function FeedbackSurvey() {
  const [answers, setAnswers] = useState([])
  const [submitted, setSubmitted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false)

  if (roles.some(x => x.includes("Admin"))) {
    return <AdminFeedbackDashboard />;
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);

        const data = await feedbackService.getAllQuestions();
        const userFeedbackData = await feedbackService.getAllFeedbacks();
        setQuestions(data);
        setAnswers(userFeedbackData);

      } catch (err) {
        console.error("Error while loading questions/answers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (answers.some((a) => a.rating === 0)) {
      alert("Molimo ocenite sva pitanja pre slanja ankete.");
      return;
    }

    const payload =
      answers.map((answer, index) => ({
        questionId: answer.questionId,
        rating: answer.rating,
        comment: answer.comment,
      }));


    console.log("Šaljem podatke:", payload);

    try {
      await feedbackService.submitFeedback(payload);
      setSubmitted(true);

    } catch (error) {
      console.error("Došlo je do greške pri slanju:", error);
      alert("Došlo je do greške. Molimo pokušajte ponovo.");
    }
  };

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
          <p className="question-text">{question.text}</p>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= answers[index].rating ? "selected" : ""
                  }`}
                onClick={() => handleRatingChange(index, star)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            placeholder="Ostavite komentar (opciono)"
            value={answers.find(a => a.questionId === question.id)?.comment}
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
