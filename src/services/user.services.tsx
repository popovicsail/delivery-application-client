import api from "./api.jsx"

export const getProfile = async () => {
    const response = await api.get("profile/me")

    return response.data;
}