
// Contiene funciones API que antes estaban en api.js y no encajan en User/Pets/Publication/Form.
// Considera dividirlo más adelante si es necesario (LocationApi, ServicesApi, etc.)
import apiClient from './apiClient';

// --- Ubicación (Barrio, Ciudad) ---
export const getBarrioUser = (id) => apiClient.get(`/barrio/${id}`);
export const getAllBarrio = () => apiClient.get('/barrio');
export const getCiudad = () => apiClient.get('/ciudad');
export const getCiudadUser = (id) => apiClient.get(`/ciudad/${id}`);

// --- Metadatos Generales (Genero, Raza, Experiencia) ---
export const getGenero = () => apiClient.get('/genero');
export const getGeneroId = (id) => apiClient.get(`/genero/${id}`);
export const getAllRazaId = (tipoMascotaId) => apiClient.get(`/raza/tipomascota/${tipoMascotaId}`);
export const getRazaId = (id) => apiClient.get(`/raza/${id}`);
export const getRaza = () => apiClient.get('/raza');
export const getExperiencia = () => apiClient.get('/experiencia'); // Para Paseador/Cuidador?

// --- Paseadores ---
export const postPaseador = (data) => apiClient.post('/paseador', data);
export const getPaseador = (params) => apiClient.get('/paseador', { params }); // Permite filtros/paginación
export const getPaseadorPorId = (id) => apiClient.get(`/paseador/${id}`);
export const getGrillaPaseador = (id) => apiClient.get(`/paseador/grilla/${id}`);
export const updatePaseador = (id, data) => apiClient.put(`/paseador/${id}`, data);
export const postFotoPaseador = (photoData) => apiClient.post('/paseadorFoto', photoData); // Probablemente necesita FormData
export const deleteFotoPaseador = (id) => apiClient.delete(`/paseadorFoto/${id}`);
export const updateGrillaPaseador = (id, data) => apiClient.put(`/paseador/grilla/${id}`, data);
export const deletePaseador = (id) => apiClient.delete(`/paseador/${id}`);

// --- Cuidadores ---
export const getCuidadores = (params) => apiClient.get('/cuidadors', { params }); // Permite filtros/paginación
export const getCuidadoresId = (id) => apiClient.get(`/cuidadors/${id}`);
export const getTipoVivienda = () => apiClient.get('/tipoViviendas'); // Relacionado con cuidador?
export const postCuidador = (data) => apiClient.post('/cuidadors', data);
export const getGrillaCuidador = (id) => apiClient.get(`/cuidadors/grilla/${id}`);
export const updateCuidador = (id, data) => apiClient.put(`/cuidadors/${id}`, data);
export const postFotoCuidador = (photoData) => apiClient.post('/cuidadorFoto', photoData); // Probablemente necesita FormData
export const deleteFotoCuidador = (id) => apiClient.delete(`/cuidadorFoto/${id}`);
export const updateGrillaCuidador = (id, data) => apiClient.put(`/cuidadors/grilla/${id}`, data);
export const deleteCuidador = (id) => apiClient.delete(`/cuidadors/${id}`);


// --- Veterinarias ---
export const postVeterinaria = (data) => apiClient.post('/veterinaria', data);
export const getVeterinarias = (params) => apiClient.get('/veterinaria', { params }); // Permite filtros/paginación
export const getVeterinariaId = (id) => apiClient.get(`/veterinaria/${id}`);
export const updateVeterinaria = (id, data) => apiClient.put(`/veterinaria/${id}`, data);
export const updateEstadoVeterinaria = (id, data) => apiClient.put(`/Veterinaria/estado/${id}`, data); // ¿Solo estado o datos completos? PUT usualmente reemplaza. Considera PATCH.
export const getHorarioVeterinaria = (id) => apiClient.get(`/veterinaria/horario/${id}`);
export const updateHorarioVeterinaria = (id, data) => apiClient.put(`/veterinaria/horario/${id}`, data);
export const getServiciosVeterinaria = (id) => apiClient.get(`/veterinaria/servicio/${id}`);
export const updateServicioVeterinaria = (id, data) => apiClient.put(`/veterinaria/servicio/${id}`, data); // Asume que servicio es una sub-entidad? O actualiza la veterinaria con servicios?
export const getEstadosVeterinaria = () => apiClient.get('/estadoveterinarias'); // Lista de posibles estados
export const deleteVeterinaria = (id) => apiClient.delete(`/veterinaria/${id}`);

// --- Fundaciones ---
export const postFundacion = (data) => apiClient.post('/fundacion', data);
export const getFundacion = (params) => apiClient.get('/fundacion', { params }); // Permite filtros/paginación
export const getFundacionId = (id) => apiClient.get(`/fundacion/${id}`);
export const updateFundacion = (id, data) => apiClient.put(`/fundacion/${id}`, data);
export const updateEstadoFundacion = (id, data) => apiClient.put(`/fundacion/estado/${id}`, data); // ¿Solo estado o datos completos? Considera PATCH.
export const deleteFundacion = (id) => apiClient.delete(`/fundacion/${id}`);


// --- NO RE-EXPORTAR OTROS MÓDULOS ---
// Elimina las líneas como: export { userApi, PetsApi, ... };
// Los componentes deben importar directamente desde el archivo específico que necesitan.
// Ejemplo: import { getUserMail } from './services/userApi';
// Ejemplo: import { getPets } from './services/PetsApi';