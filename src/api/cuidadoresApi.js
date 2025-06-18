import apiClient from "./apiClient";

export const getCuidadores = (params) => apiClient.get('/cuidadors', { params }); // Permite filtros/paginación
export const getCuidadoresId = (id) => apiClient.get(`/cuidadors/${id}`);

export const postCuidador = (data) => apiClient.post('/cuidadors', data);
export const deleteCuidador = (id) => apiClient.delete(`/cuidadors/${id}`);
