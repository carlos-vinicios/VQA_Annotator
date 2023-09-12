import axios from 'axios';

const selectorServices = {
    getNextReport: async () => {
        const { data } = await axios.get(`/api/selections/report`);
        return data;
    },
    savePageMetadatas: async (metadatas) => {
        const { data } = await axios.post(`/api/selections/metadata`, metadatas);
        return data;
    }
}

export default selectorServices;