import { api } from "@/services/api";

const apiServices = {
    getNextEvaluationFile: async () => {
        const { data } = await api.get(`/evaluation/next`);
        return data;
    },
    listFilesToEvaluation: async () => {
        const { data } = await api.get(`/evaluation/list`);
        return data;
    },
    saveEvaluations: async (file_id, evaluations) => {
        const { data } = await api.post(`/evaluation/${file_id}`, evaluations);
        return data;
    }
}

export default apiServices;