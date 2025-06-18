import apiClient from "./apiClient";

export const getProvincia = async () => apiClient.get("/provincia");

export const getCiudadesPorProvincia = async (provinciaId) =>
  apiClient.get(`/ciudad/provincia/${provinciaId}`);

export const getBarriosPorCiudad = async (ciudadId) =>
  apiClient.get(`/barrio/ciudad/${ciudadId}`);

export const getCiudades = async () => apiClient.get("/ciudad");
export const getGeneros = () => apiClient.get('/genero');

export const getBarrios = async () => apiClient.get("/barrio");

export const getEdades = async () => apiClient.get("/edadMascota");

export const getSexos = async () => apiClient.get("/sexoMascota");

export const getExperiencia = () => apiClient.get('/experiencia'); // Para Paseador/Cuidador

export const getTipoVivienda = () => apiClient.get('/tipoViviendas'); // Relacionado con cuidador

export const getVeterinarias = (params) => apiClient.get('/veterinaria', { params }); // Permite filtros/paginación

export const getTipoMascota = async () => apiClient.get("/tipoMascota");
export const getAllEdadMascota = async () => apiClient.get("/edadMascota");



export const updateEstadoVeterinaria = (id, data) => apiClient.put(`/Veterinaria/estado/${id}`, data); // ¿Solo estado o datos completos? PUT usualmente reemplaza. Considera PATCH.



export const postVeterinaria = (data) => apiClient.post('/veterinaria', data);
export const deleteVeterinaria = (id) => apiClient.delete(`/veterinaria/${id}`);
