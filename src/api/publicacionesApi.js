import apiClient from "./apiClient";

/**
 * Obtener mascotas en adopción (tipo de publicación = Adopcion)
 */
export const getMascotasEnAdopcion = async () => {
  try {
    const response = await apiClient.get("/publicacionMascota/tipo/Adopcion?estado=Activa");
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
    const response = await apiClient.get("/publicacionMascota/tipo/Perdida?estado=Activa");
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
    const response = await apiClient.get("/publicacionMascota/tipo/Encontrada?estado=Activa");
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
    console.error("URL de la petición:", error.config?.url);
    console.error("Datos enviados:", error.config?.data);
    throw error;
  }
};

export const deleteFotoPosteo = async (id) => {
  try {
    const response = await apiClient.delete(`/publicacionMascotaFoto/${id}`);
    return response;
  } catch (error) {
    console.error("Error al eliminar foto:", error);
    console.error("URL de la petición:", error.config?.url);
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

/**
 * Obtener estado del procesamiento IA de una publicación
 */
export const getEstadoIA = async (id) => {
  try {
    const response = await apiClient.get(`/publicaciones/${id}/estado-ia`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener estado IA:", error);
    return { ia_indexed: false, ia_matched: false };
  }
};

/**
 * Cambiar el estado de una publicación (finalizada/cancelada)
 */
export const cambiarEstadoPublicacion = async (id, estadoId) => {
  try {
    const payload = {
      estadoid: estadoId
    };
    
   
    
    const response = await apiClient.put(`/publicacionMascota/${id}/cambiar-estado`, payload);
    
   
    return response.data;
  } catch (error) {
    console.error("Error al cambiar estado de publicación:", error);
    throw error;
  }
};

/**
 * Obtener estadísticas para la landing page
 */
export const getEstadisticasLanding = async () => {
  try {
    const response = await apiClient.get("/stats/mascotas-encontradas-resumen");
    return response.data;
  } catch (error) {
    console.error("Error al obtener estadísticas de landing:", error);
    // Retornar valores por defecto en caso de error
    return {
      totalEncontradas: 0,
      totalFinalizadas: 0,
      tiempoPromedio: 0,
      tasaExito: 0
    };
  }
};

/**
 * Obtener estadísticas de publicaciones finalizadas para admin
 */
export const getEstadisticasPublicacionesFinalizadas = async (months = 12) => {
  try {
    const response = await apiClient.get(`/stats/publicaciones-finalizadas/by-month?months=${months}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener estadísticas de publicaciones finalizadas:", error);
    return [];
  }
};

/**
 * Obtener todos los estados de publicación disponibles
 */
export const getEstadosPublicacion = async () => {
  try {
    const response = await apiClient.get("/EstadoPublicacion");
    return response.data;
  } catch (error) {
    console.error("Error al obtener estados de publicación:", error);
    // Retornar estados por defecto en caso de error
    return [
      { id: 1, nombre: "Activa" },
      { id: 2, nombre: "Finalizada" },
      { id: 3, nombre: "Cancelada" }
    ];
  }
};

