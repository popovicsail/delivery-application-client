import api from "./api";

export const getOneOffer = async (offerId) => {
  const response = await api.get(`/offers/${offerId}`);
  return response.data;
}

export const createOffer = async (restaurantId, offerData) => {
  const response = await api.post(`/offers?restaurantId=${restaurantId}`, offerData);
  return response.data;
}

export const updateOffer = async (offerId, offerData) => {
  const response = await api.put(`/offers/${offerId}`, offerData);
  return response.data;
}

export const deleteOffer = async (offerId) => {
  const response = await api.delete(`/offers/${offerId}`);
  return response.data;
}

export const getByRestaurant = async (restaurantId) => {
  const response = await api.get(`/offers/?restaurantId=${restaurantId}`);
  return response.data;
}

export const manageOfferDishes = async (offerId, dishes) => {
  const response = await api.post(`/offers/${offerId}/dishes/manage`, dishes);
  return response.data;
}