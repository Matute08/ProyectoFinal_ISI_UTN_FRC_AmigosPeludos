import apiClient from "./apiClient";


// Obtener todas las vacunas disponibles del sistema (vacunas generales)
export const getVacunas = async () => {
  return await apiClient.get("/vacuna");
};

// Obtener las vacunas aplicadas a una mascota específica
export const getVacunasMascota = async (idMascota) => {
  return await apiClient.get(`/CarnetVacunacion/${idMascota}`);
};

// Obtener las vacunas disponibles para un tipo específico de mascota
export const getVacunasPorTipo = async (tipoMascotaId) => {
  return await apiClient.get(`/Vacuna/TipoMascota/${tipoMascotaId}`);
};

// Registrar una nueva vacuna aplicada a una mascota
export const postVacunaMascota = async (data) => {
  return await apiClient.post("/CarnetVacunacion", data);
};

// Eliminar una dosis específica de vacuna
export const deleteDosisVacuna = async (idDosis) => {
  return await apiClient.delete(`/CarnetVacunacion/${idDosis}`);
};

// Eliminar todas las dosis de una vacuna específica para una mascota
export const deleteVacunaMascota = async (mascotaId, vacunaId) => {
  return await apiClient.delete(`/CarnetVacunacion/mascota/${mascotaId}/vacuna/${vacunaId}`);
};

// Eliminar todas las dosis de una mascota
export const deleteTodasLasDosisMascota = async (mascotaId) => {
  return await apiClient.delete(`/CarnetVacunacion/mascota/${mascotaId}`);
};

// Actualizar una dosis de vacuna (para funcionalidad de editar)
export const updateDosisVacuna = async (idDosis, data) => {
  return await apiClient.put(`/CarnetVacunacion/${idDosis}`, data);
};
