import axios from 'axios';

const selectorServices = {
    getNextReport: async () => {
        const { data } = await axios.get(`/api/report/selection`);
        return data;
    },
    savePageMetadatas: async (metadatas) => {
        const { data } = await axios.post(`/api/selection/metadata`, metadatas);
        return data;
    }
}

export default selectorServices;