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



export const updateEstadoVeterinaria = (id, data) => apiClient.put(`/veterinaria/estado/${id}`, data);



export const postVeterinaria = (data) => apiClient.post('/veterinaria', data);
export const updateVeterinaria = (id, data) => apiClient.put(`/veterinaria/${id}`, data);
export const deleteVeterinaria = (id) => apiClient.put(`/veterinaria/baja/${id}`);

// Obtener veterinaria por usuario
export const getVeterinariaByUsuario = async (usuarioId) => {
  try {
    const response = await apiClient.get(`/veterinaria/usuario/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener veterinaria por usuario:', error);
    throw error;
  }
};

// Comparaciones automáticas de mascotas
export const getComparacionesByPublicacion = async (publicacionId) => {
  const response = await apiClient.get(`/publicacionmascota/comparaciones/${publicacionId}`);
  return response.data;
};
