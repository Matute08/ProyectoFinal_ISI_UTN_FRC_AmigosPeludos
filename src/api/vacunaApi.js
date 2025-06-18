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

// (Opcional) Eliminar una vacuna de una mascota
export const deleteVacunaMascota = async (idVacunaAplicada) => {
  return await apiClient.delete(`/CarnetVacunacion/${idVacunaAplicada}`);
};
