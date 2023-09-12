import axios from 'axios';

const apiServices = {
    getNextFile: async () => {
        const { data } = await axios.get(`/api/reports/nextFile`);
        return data;
    },
    saveAnnotations: async (annotation) => {
        const { data } = await axios.post(`/api/annotations`, annotation);
        return data;
    },
    savePageMetadatas: async (metadatas) => {
        const { data } = await axios.post(`/api/selections/metadata`, metadatas);
        return data;
    }
}

export default apiServices;