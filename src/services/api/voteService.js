import { api } from "@/services/api";

const apiServices = {
    getNextVoteFile: async () => {
        const { data } = await api.get(`/vote/next`);
        return data;
    },
    getFileToVisualize: async (filename, generationModel) => {
        const { data } = await api.get(`/document/visualization/${filename}/${generationModel}`);
        return data;
    },
    saveVotes: async (file_id, votes) => {
        const { data } = await api.post(`/vote/${file_id}`, votes);
        return data;
    },
    saveEvaluations: async (file_id, evaluations) => {
        const { data } = await api.post(`/vote/${file_id}`, evaluations);
        return data;
    }
}

export default apiServices;