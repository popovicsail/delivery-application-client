import api from "./api";

export interface Feedback {
  user: string;
  date: string;
  rating: number[];
  comment: string;
}

export const feedbackService = {
  getAllQuestions: async () => {
    const response = await api.get(`/Feedback/questions`);
    return response.data;
  },

  getAllFeedbacks: async (): Promise<Feedback[]> => {
    const response = await api.get(`/Feedback/user`);
    return response.data;
  },

  submitFeedback: async (data:Feedback[]): Promise<Feedback[]> => {
    const response = await api.post(`feedback`, data);

    return response.data;
  } 
};
