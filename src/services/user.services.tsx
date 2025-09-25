const API_URL = "http://localhost:7290/api/users";

export const userService = {
  async login(username, password) {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message);
    }

    return response.json();
  },

  async getTourReservationsByUserId(userId) {
    const response = await fetch(`${API_URL}/${userId}/tour-reservations`);

    if (!response.ok) {
      const message = await response.text();
      throw { status: response.status, message };
    }

    return response.json();
  },

  async getTourRatingsByUserId(userId) {
    const response = await fetch(`${API_URL}/${userId}/tour-ratings`);

    if (!response.ok) {
      const message = await response.text();
      throw { status: response.status, message };
    }

    return response.json();
  },

  async updateUser(user) {
    const response = await fetch(`${API_URL}/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const message = await response.text();
      throw { status: response.status, message };
    }
  },

  async createUser(user) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const message = await response.text();
      throw { status: response.status, message };
    }
  },
};
