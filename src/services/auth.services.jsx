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

export const googleLogin = async (googleToken) => {

  const loginData = {
    googleToken: googleToken
  }

  const response = await api.post("/auth/google-login", loginData);

  if (response.data.token) {
    sessionStorage.setItem("token", response.data.token);
  }

  return response.data;

}


export const logout = () => {
  sessionStorage.clear();
};
