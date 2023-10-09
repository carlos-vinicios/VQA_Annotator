import axios from 'axios';

const apiServices = {
    getNextFile: async () => {
        const { data } = await axios.get(`/api/page/annotation`);
        return data;
    },
    saveTime: async (time) => {
        const { data } = await axios.post(`/api/annotation/time`, time);
        return data;
    },
    saveAnnotations: async (annotation) => {
        const { data } = await axios.post(`/api/question`, annotation);
        return data;
    }
}

export default apiServices;