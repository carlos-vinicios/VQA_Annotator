import axios from "axios";

const apiServices = {
  getNextQuestion: async () => {
    // const { data } = await axios.get(`/api/validate/page`);
    const data = "teste"
    return data;
  },
  saveResponse: async (response) => {
    // const { data } = await axios.post(`/api/validate`, response);
    const data = "teste"
    return data;
  },
};

export default apiServices;
