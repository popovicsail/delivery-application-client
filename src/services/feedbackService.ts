import api from "./api";

export interface Feedback {
  user: string;
  date: string;
  ratings: number[];
  comment: string;
}

export const feedbackService = {
  getAllQuestions: async () => {
    const response = await api.get(`/Feedback/questions`);
    return response.data;
  },

  getAllFeedbacks: async (): Promise<Feedback[]> => {
    const res = await fetch("/api/Feedback/all");
    if (!res.ok) throw new Error("Greška pri učitavanju feedbacka");
    return res.json();
  },
};
