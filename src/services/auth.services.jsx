import api from './api'

export const login = async (userName, password) => {
    
    const loginData = {
        userName: userName,
        password: password
    }

  const response = await api.post("/auth/login", loginData);

  if (response.data.token) {
    sessionStorage.setItem("token", response.data.token);
  }

  return response.data;
};


export const logout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("myProfile");
  sessionStorage.clear();
};
