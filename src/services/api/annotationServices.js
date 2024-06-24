import { api } from "@services/api";

const apiServices = {
    getNextFile: async (user) => {
        const { data } = await api.get(`/api/annotation/page/${user}`);
        return data;
    },
    saveAnnotations: async (annotation) => {
        const { data } = await api.post(`/api/annotation`, annotation);
        return data;
    }
}

export default apiServices;