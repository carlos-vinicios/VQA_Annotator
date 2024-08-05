import { api } from "@/services/api";

const apiServices = {
    getFileToVisualize: async (fileId) => {
        const { data } = await api.get(`/document/visualization/${fileId}`);
        return data;
    },
    getDocumentPage: async (fileId) => {
        const config = { responseType: 'blob' };
        const { data } = await api.get(`/document/${fileId}`, config);
        return new File([data], "document_page");
    }
}

export default apiServices;