import apiClient from "./apiClient";


export const getFundacion = (params) => apiClient.get('/fundacion', { params }); // Permite filtros/paginación
export const getFundacionId = (id) => apiClient.get(`/fundacion/${id}`);
export const updateEstadoFundacion = (id, data) => apiClient.put(`/fundacion/estado/${id}`, data); // ¿Solo estado o datos completos? Considera PATCH.

export const postFundacion = (data) => apiClient.post('/fundacion', data);
export const updateFundacion = (id, data) => apiClient.put(`/fundacion/${id}`, data);
export const deleteFundacion = (id) => apiClient.put(`/fundacion/baja/${id}`);

// Obtener fundación por usuario
export const getFundacionByUsuario = async (usuarioId) => {
  try {
    const response = await apiClient.get(`/fundacion/usuario/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener fundación por usuario:', error);
    throw error;
  }
};