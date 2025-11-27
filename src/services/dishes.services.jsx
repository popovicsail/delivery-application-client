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
  getAll: async (filters, sort) => {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.allergicOnAlso) {
        filters.allergicOnAlso = filters.allergicOnAlso.toString();
        if (filters.allergicOnAlso) params.append("AllergicOnAlso", filters.allergicOnAlso);
      }
      if (filters.name) params.append("Name", filters.name);
      if (filters.type) params.append("Type", filters.type);
      if (filters.minPrice) params.append("MinPrice", filters.minPrice);
      if (filters.maxPrice) params.append("MaxPrice", filters.maxPrice);
      if (filters.restaurantId) params.append("RestaurantId", filters.restaurantId);
    }
    if (sort) {
      params.append("sort", sort);
    }
    const response = await api.get(`/dishes/filtered?${params.toString()}`);
    return response.data;
  },

  getPaged: async (sort, filters, page) => {
    const params = new URLSearchParams();
    filters.allergicOnAlso = filters.allergicOnAlso.toString()

    if (filters.name) params.append("Name", filters.name);
    if (filters.type) params.append("Type", filters.type);
    if (filters.minPrice) params.append("MinPrice", filters.minPrice);
    if (filters.maxPrice) params.append("MaxPrice", filters.maxPrice);
    if (filters.allergicOnAlso) params.append("AllergicOnAlso", filters.allergicOnAlso);
    params.append("sort", sort);
    params.append("page", page)

    const response = await api.get(`/dishes/paged?${params.toString()}`);

    return response.data;
  },

  getMenuByid: async (id) => {
    const response = await api.get(`/dishes/menu/${id}`);
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

  updateGroup: async (data, id) => {
    const response = await api.put(`/dishOptionGroups/${id}`, data)
    return response.data;
  },

  deleteGroup: async (id) => {
    await api.delete(`/dishOptionGroups/${id}`);
  }
};
