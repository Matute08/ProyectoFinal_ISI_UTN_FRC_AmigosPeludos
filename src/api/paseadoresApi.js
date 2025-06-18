import apiClient from "./apiClient";

export const getPaseadores = (params) => apiClient.get("/paseador", { params }); // Permite filtros/paginación
export const getPaseadorPorId = (id) => apiClient.get(`/paseador/${id}`);
export const getGrillaPaseador = (id) =>
    apiClient.get(`/paseador/grilla/${id}`);
export const postPaseador = (data) => apiClient.post("/paseador", data);
export const postFotoPaseador = (photoData) =>
    apiClient.post("/paseadorFoto", photoData); // Probablemente necesita FormData
export const deletePaseador = (id) => apiClient.delete(`/paseador/${id}`);
export const deleteFotoPaseador = (id) =>
    apiClient.delete(`/paseadorFoto/${id}`);
export const updatePaseador = (id, data) =>
    apiClient.put(`/paseador/${id}`, data);
export const updateGrillaPaseador = (id, data) =>
    apiClient.put(`/paseador/grilla/${id}`, data);
