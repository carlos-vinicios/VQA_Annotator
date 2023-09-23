import axios from 'axios';

const apiServices = {
    getNextFile: async () => {
        const { data } = await axios.get(`/api/annotations/page`);
        return data;
    },
    saveAnnotations: async (annotation) => {
        const { data } = await axios.post(`/api/annotations`, annotation);
        return data;
    }
}

export default apiServices;