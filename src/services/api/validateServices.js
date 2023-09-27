import axios from "axios";

const apiServices = {
  getNextQuestion: async () => {
    const { data } = await axios.get(`/api/question`);
    return data;
  },
  getQuestionPage: async (pageFilename) => {
    const { data } = await axios.get(`/api/page/${pageFilename}`);
    return data;
  },
  saveResponse: async (response) => {
    const { data } = await axios.post(`/api/question/validate`, response);
    return data;
  },
};

export default apiServices;
