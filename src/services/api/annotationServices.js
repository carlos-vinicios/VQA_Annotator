import axios from 'axios';

const apiServices = {
    getNextFile: async (user) => {
        const { data } = await axios.get(`/api/annotation/page/${user}`);
        return data;
    },
    saveAnnotations: async (annotation) => {
        const { data } = await axios.post(`/api/annotation`, annotation);
        return data;
    }
}

export default apiServices;