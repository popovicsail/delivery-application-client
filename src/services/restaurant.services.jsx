import api from "./api.jsx"

export const getRestaurants = async () => {
    const response = await api.get("restaurants/all");

    return response.data;
}

export const getMyRestaurants = async () => {
    const response = await api.get("restaurants/my-restaurants");
    
    return response.data;
}

export const getOneRestaurant = async (id) => {
    const response = await api.get("restaurants/" + id);

    return response.data;
}

export const deleteRestaurant = async (id) => {
    const response = await api.delete("restaurants/" + id);

    return response.data;
}

export const updateRestaurant = async (id, data) => {
    const response = await api.put("restaurants/" + id, data);
    
    return response.data;
}

export const createRestaurant = async (data) => {
    const response = await api.post("restaurants", data);
    
    return response.data;
}

export const uploadImage = async (id, image) => {
  const response = await api.post(`restaurants/${id}/image`, image, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
}

export const getImage = async (id) => {
  const response = await api.get(`restaurants/${id}/image`, {
    responseType: 'blob'
  });
  return response.data;
}