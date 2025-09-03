import apiClient from "./apiClient";

export const getCuidadores = (params) => apiClient.get('/cuidadors', { params }); // Permite filtros/paginación
export const getCuidadoresId = (id) => apiClient.get(`/cuidadors/${id}`);

export const postCuidador = (data) => apiClient.post('/cuidadors', data);
export const updateCuidador = (id, data) => apiClient.put(`/cuidadors/${id}`, data);
export const deleteCuidador = (id) => apiClient.delete(`/cuidadors/${id}`);

// APIs para fotos de cuidador (igual que paseador)
export const postFotoCuidador = (photoData) =>
    apiClient.post("/cuidadorFoto", photoData);
export const deleteFotoCuidador = (id) =>
    apiClient.delete(`/cuidadorFoto/${id}`);
