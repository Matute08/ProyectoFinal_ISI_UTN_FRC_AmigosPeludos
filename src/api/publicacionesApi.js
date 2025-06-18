import apiClient from "./apiClient";

/**
 * Obtener mascotas en adopción (tipo de publicación = Adopcion)
 */
export const getMascotasEnAdopcion = async () => {
  try {
    const response = await apiClient.get("/publicacionMascota/tipo/Adopcion");
    return response.data;

  } catch (error) {
    console.error("Error al obtener mascotas en adopción:", error);
    return [];
  }
};
/**
 * Obtener mascotas perdidas (tipo de publicación = Perdida)
 */

export const getMascotasPerdidas = async () => {
  try {
    const response = await apiClient.get("/publicacionMascota/tipo/Perdida");
    return response.data;
  } catch (error) {
    console.error("Error al obtener mascotas perdidas:", error);
    return [];
  }
};
/**
 * Obtener mascotas encontradas (tipo de publicación = Encontrada)
 */

export const getMascotasEncontradas = async () => {
  try {
    const response = await apiClient.get("/publicacionMascota/tipo/Encontrada");
    return response.data;
  } catch (error) {
    console.error("Error al obtener mascotas encontradas:", error);
    return [];
  }
};
/**
 * Obtener detalle de mascotas
 */
export const getDetallePublicacion = async (id) => {
  try {
    const response = await apiClient.get(`/publicacionMascota/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener detalle de publicación:", error);
    return null;
  }
};

export const postMascotaEncontrada = async (data) => {
  try {
    const response = await apiClient.post("/publicacionMascota", data);
    return response;
  } catch (error) {
    console.error("Error al guardar publicación:", error);
    throw error;
  }
};
export const postMascotaPerdida = async (data) => {
  try {
    const response = await apiClient.post("/publicacionMascota", data);
    return response;
  } catch (error) {
    console.error("Error al guardar mascota perdida:", error);
    throw error;
  }
};

export const postMascotaAdopcion = async (data) => {
  try {
    const response = await apiClient.post("/publicacionMascota", data);
    return response;
  } catch (error) {
    console.error("Error al guardar mascota en adopcion:", error);
    throw error;
  }
};

export const updatePublicacion = async (id, data) => {
  try {
    const response = await apiClient.put(`/publicacionMascota/${id}`, data);
    return response;
  } catch (error) {
    console.error("Error al actualizar mascota:", error);
    throw error;
  }
};

export const deleteFotoPosteo = async (id) => {
  try {
    const response = await apiClient.delete(`/publicacionMascotaFoto/${id}`);
    return response;
  } catch (error) {
    console.error("Error al eliminar foto:", error);
    throw error;
  }
};
export const postFotoPosteo = async (photoData) => {
  try {
    const response = await apiClient.post('/publicacionMascotaFoto', photoData);
    return response;
  } catch (error) {
    console.error("Error al guardar foto:", error);
    throw error;
  }
};

