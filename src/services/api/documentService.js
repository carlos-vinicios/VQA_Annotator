import { api } from "@/services/api";

const apiServices = {
    getFileToVisualize: async (fileId) => {
        const { data } = await api.get(`/document/visualization/${fileId}`);
        return data;
    },
}

export default apiServices;