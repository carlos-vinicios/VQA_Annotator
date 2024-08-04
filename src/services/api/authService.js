import { api } from "@/services/api";

const apiServices = {
  login: async (authData) => {
    const { data } = await api.post(`/login`, authData, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // atualizacao do valor do Authorization bearer token para o valor de access_token
    api.defaults.headers["Authorization"] = `Bearer ${data.access_token}`;
    return data;
  },
  singup: async (userData) => {
    const { data } = await api.post("/register", userData);
    return data;
  },
};

export default apiServices;
