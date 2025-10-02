import api from "./api";
export interface Extra {
  id?: string;
  name: string;
  price?: number;
  type: "nezavisni" | "izborni";
}
export interface Dish {
  id?: string;
  name: string;
  description?: string;
  price: number;
  pictureURL?: string;
  type: string;
  extras?: Extra[];
}

export const dishService = {
  getAll: async (): Promise<Dish[]> => {
    const response = await api.get<Dish[]>("/dishes");
    return response.data;
  },

  getById: async (id: number): Promise<Dish> => {
    const response = await api.get<Dish>(`/dishes/${id}`);
    return response.data;
  },

  create: async (dish: Dish): Promise<Dish> => {
    const response = await api.post<Dish>("/dishes", dish);
    return response.data;
  },

  update: async (id: number, dish: Dish): Promise<Dish> => {
    const response = await api.put<Dish>(`/dishes/${id}`, dish);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/dishes/${id}`);
  },

  //Dish group
  createGroup: async (extra: Extra): Promise<Extra> => {
    const response = await api.post<Extra>("/dishOptionGroups", extra);
    return response.data;
  },
};
