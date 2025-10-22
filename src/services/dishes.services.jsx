import api from "./api";
/*export interface Extra {
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
}*/

export const dishService = {
  getAll: async () => {
    const response = await api.get("/dishes");
    return response.data;
  },

  getRestaurantMenu: async (id) => {
    const response = await api.get(`restaurants/${id}/menu`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/dishes/${id}`);
    return response.data;
  },

  create: async (dish) => {
    const response = await api.post("/dishes", dish);
    return response.data;
  },

  update: async (id, dish) => {
    const response = await api.put(`/dishes/${id}`, dish);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/dishes/${id}`);
  },

  //Dish group
  createGroup: async (extra) => {
    const response = await api.post("/dishOptionGroups", extra);
    return response.data;
  },
};
