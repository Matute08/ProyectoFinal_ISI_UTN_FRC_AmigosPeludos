import apiClient from "./apiClient"; // mismo client que usás en statsApi

export const getFaq = () => apiClient.get("/faq").then(r => r.data);
export const getFaqCategories = () => apiClient.get("/faq/categorias").then(r => r.data);

export const createFaq = (payload) => apiClient.post("/faq", payload).then(r => r.data);
export const updateFaq = (id, payload) => apiClient.put(`/faq/${id}`, payload);
export const deleteFaq = (id) => apiClient.delete(`/faq/${id}`);
