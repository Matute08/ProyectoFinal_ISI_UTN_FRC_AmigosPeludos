import apiClient from "./apiClient";


export const getFundacion = (params) => apiClient.get('/fundacion', { params }); // Permite filtros/paginación
export const getFundacionId = (id) => apiClient.get(`/fundacion/${id}`);
export const updateEstadoFundacion = (id, data) => apiClient.put(`/fundacion/estado/${id}`, data); // ¿Solo estado o datos completos? Considera PATCH.

export const postFundacion = (data) => apiClient.post('/fundacion', data);
export const deleteFundacion = (id) => apiClient.delete(`/fundacion/${id}`);
