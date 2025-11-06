import apiClient from "./apiClient";

// Obtener valoraciones por cuidador
export const getValoracionesPorCuidador = (idCuidador) => 
  apiClient.get(`/valoraciones/por-cuidador/${idCuidador}`);

// Obtener valoraciones por paseador
export const getValoracionesPorPaseador = (idPaseador) => 
  apiClient.get(`/valoraciones/por-paseador/${idPaseador}`);

// Crear una nueva valoración
export const postValoracion = (valoracion) => 
  apiClient.post("/valoraciones", valoracion);

// Eliminar una valoración
export const deleteValoracion = (idValoracion) => 
  apiClient.delete(`/valoraciones/${idValoracion}`);

export const putValoracion = (valoracion) =>
  apiClient.put(`/valoraciones/${valoracion.id}`, valoracion);

// Responder una valoración 
export const putRespuestaValoracion = (idValoracion, respuesta) =>
  apiClient.put(`/valoraciones/respuesta/${idValoracion}`, { respuesta });


// Eliminar la respuesta (solo deja el campo vacío)
export const eliminarRespuestaValoracion = (idValoracion) =>
  apiClient.delete(`/valoraciones/eliminar-respuesta/${idValoracion}`);


