import apiClient from './apiClient';

// Obtener tipos de anunciantes activos
export const getTiposAnunciante = async () => {
  try {
    const response = await apiClient.get('/publicidades/tipos-anunciante');
    return response.data;
  } catch (error) {
    console.error('Error al obtener tipos de anunciante:', error);
    throw error;
  }
};


// Obtener todas las publicidades activas
export const getPublicidadesActivas = async () => {
  try {
    const response = await apiClient.get('/publicidades/activas');
    return response.data;
  } catch (error) {
    console.error('Error al obtener publicidades activas:', error);
    throw error;
  }
};

// Obtener publicidades por ubicación
export const getPublicidadesPorUbicacion = async (ubicacion) => {
  try {
    const response = await apiClient.get(`/publicidades/ubicacion/${ubicacion}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener publicidades para ${ubicacion}:`, error);
    throw error;
  }
};

// Crear nueva publicidad
export const crearPublicidad = async (publicidadData) => {
  try {
    const response = await apiClient.post('/publicidades', publicidadData);
    return response.data;
  } catch (error) {
    console.error('Error al crear publicidad:', error);
    throw error;
  }
};

// Obtener todas las publicidades (admin)
export const getAllPublicidades = async () => {
  try {
    const response = await apiClient.get('/publicidades');
    return response.data;
  } catch (error) {
    console.error('Error al obtener todas las publicidades:', error);
    throw error;
  }
};


// Actualizar publicidad
export const actualizarPublicidad = async (id, publicidadData) => {
  try {
    const response = await apiClient.put(`/publicidades/${id}`, publicidadData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar publicidad:', error);
    throw error;
  }
};

// Eliminar publicidad
export const eliminarPublicidad = async (id) => {
  try {
    const response = await apiClient.put(`/publicidades/${id}/desactivar`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar publicidad:', error);
    throw error;
  }
};

// Cambiar estado de publicidad
export const cambiarEstadoPublicidad = async (id, estadoId) => {
  try {
    const response = await apiClient.put(`/publicidades/${id}/estado`, { estadoId });
    return response.data;
  } catch (error) {
    console.error('Error al cambiar estado de publicidad:', error);
    throw error;
  }
};

// Registrar clic en publicidad
export const registrarClicPublicidad = async (id) => {
  try {
    const response = await apiClient.put(`/publicidades/${id}/clic`);
    return response.data;
  } catch (error) {
    console.error('Error al registrar clic:', error);
    throw error;
  }
};

// Registrar visualización de publicidad
export const registrarVisualizacionPublicidad = async (id) => {
  try {
    const response = await apiClient.put(`/publicidades/${id}/visualizacion`);
    return response.data;
  } catch (error) {
    console.error('Error al registrar visualización:', error);
    throw error;
  }
};

// Obtener estadísticas de publicidades
export const getEstadisticasPublicidades = async () => {
  try {
    const response = await apiClient.get('/publicidades/estadisticas');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};

// Obtener precios por ubicación
export const getPreciosUbicaciones = async () => {
  try {
    const response = await apiClient.get('/ubicacionpublicidad/precios');
    return response.data;
  } catch (error) {
    console.error('Error al obtener precios:', error);
    throw error;
  }
};

// Actualizar precio de ubicación
export const actualizarPrecioUbicacion = async (id, precio) => {
  try {
    const response = await apiClient.put(`/ubicacionpublicidad/${id}/precio`, { precio });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar precio:', error);
    throw error;
  }
};


// Obtener ubicaciones
export const getUbicaciones = async () => {
  try {
    const response = await apiClient.get('/publicidades/ubicaciones');
    return response.data;
  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
    throw error;
  }
};

// Obtener estados de publicidades
export const getEstadosPublicidad = async () => {
  try {
    const response = await apiClient.get('/publicidades/estados');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estados:', error);
    throw error;
  }
};

// Obtener publicidades de un usuario específico
export const getPublicidadesUsuario = async (usuarioId) => {
  try {
    const response = await apiClient.get(`/publicidades/usuario/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener publicidades del usuario:', error);
    throw error;
  }
};

// Obtener estadísticas por período de un usuario
export const getEstadisticasUsuarioPeriodo = async (usuarioId, desde, hasta) => {
  try {
    const response = await apiClient.get(`/publicidades/usuario/${usuarioId}/estadisticas?desde=${desde}&hasta=${hasta}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas del período:', error);
    throw error;
  }
};

// Obtener rendimiento por ubicación de un usuario
export const getRendimientoUbicacionUsuario = async (usuarioId) => {
  try {
    const response = await apiClient.get(`/publicidades/usuario/${usuarioId}/rendimiento-ubicacion`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener rendimiento por ubicación:', error);
    throw error;
  }
};

// Obtener tendencias de CTR de un usuario
export const getTendenciasCTRUsuario = async (usuarioId, periodo = 30) => {
  try {
    const response = await apiClient.get(`/publicidades/usuario/${usuarioId}/tendencias?periodo=${periodo}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener tendencias de CTR:', error);
    throw error;
  }
};

// Verificar si el usuario tiene publicidades (usa endpoint existente)
export const tienePublicidadesUsuario = async (usuarioId) => {
  try {
    const response = await apiClient.get(`/publicidades/usuario/${usuarioId}`);
    // Si la respuesta es exitosa, verificar si tiene datos
    const publicidades = response.data || [];
    return { count: publicidades.length };
  } catch (error) {
    console.error('Error al verificar publicidades del usuario:', error);
    // En caso de error, retornar 0 para no mostrar el menú
    return { count: 0 };
  }
};

// Obtener estadísticas de pagos de publicidades
export const getEstadisticasPagos = async (desde, hasta) => {
  try {
    const response = await apiClient.get(`/publicidades/pagos/estadisticas`, {
      params: {
        desde,
        hasta
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas de pagos:', error);
    throw error;
  }
};

// Obtener estadísticas por ubicación
export const getEstadisticasPorUbicacion = async (desde, hasta) => {
  try {
    const response = await apiClient.get(`/publicidades/estadisticas/por-ubicacion`, {
      params: {
        desde,
        hasta
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas por ubicación:', error);
    throw error;
  }
};

// Obtener estadísticas detalladas por ubicación específica
export const getEstadisticasDetalladasUbicacion = async (ubicacionId, desde, hasta) => {
  try {
    const response = await apiClient.get(`/publicidades/estadisticas/ubicacion/${ubicacionId}`, {
      params: {
        desde,
        hasta
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas detalladas de ubicación:', error);
    throw error;
  }
};