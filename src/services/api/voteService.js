import { api } from "@/services/api";

const apiServices = {
    getNextVoteFile: async () => {
        const { data } = await api.get(`/vote/next`);
        return data;
    },
    saveVotes: async (file_id, votes) => {
        const { data } = await api.post(`/vote/${file_id}`, votes);
        return data;
    }
}

export default apiServices;