import api from "./api";

export interface Feedback {
  user: string;
  date: string;
  rating: number[];
  comment: string;
}

export interface FeedbackStatisticsRequest {
  questionId: string;
  timeRange?: "LastWeek" | "LastMonth" | "Last3Months" | "LastYear";
  sortField?: "Rating" | "UserName" | "CreatedAt";
  sortOrder?: "ASC" | "DESC";
  searchTerm?: string; 
}

export interface DailyAverage {
  date: string;
  average: number;
}

export interface FeedbackStats {
  questionId: string;
  questionText: string;
  averageRating: number;
  totalResponses: number;
  dailyAverages: DailyAverage[];
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

  submitFeedback: async (data: Feedback[]): Promise<any> => {
    const response = await api.post(`/Feedback/submit`, data);
    return response.data;
  },

  getStatistics: async (filters: FeedbackStatisticsRequest): Promise<FeedbackStats[]> => {
    const response = await api.post(`/Feedback/statistics`, filters);
    return response.data;
  }
};
