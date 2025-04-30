// src/services/PublicationsPetsApi.js
import apiClient from './apiClient';

/**
 * GET PUBLICACIONES
 * @param {object} params - Opcional: objeto con parámetros de query para filtrar/paginar
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getPublicaciones(params) {
    return apiClient.get('/publicacionMascota', { params });
}

/**
 * GET PUBLICACIONES ID
 * @param {string} id - ID de la publicación
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getPublicacionesId(id) {
    return apiClient.get(`/publicacionMascota/${id}`);
}

/**
 * GET PUBLICACIONES DE UN USUARIO (por email)
 * @param {string} mail - Email del usuario
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getPublicacionesUser(mail) {
    // Asegúrate de que el email se codifique correctamente para la URL si contiene caracteres especiales
    return apiClient.get(`/publicacionMascota/email/${encodeURIComponent(mail)}`);
}

/**
 * GET TIPO DE PUBLICACIONES MASCOTAS (Perdidas, Encontradas, Adopción)
 * @param {string | number} tipoPublicacion - El tipo de publicación (ej. 'perdido', 'encontrado', 1, 2)
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getMascotasPublicadas(tipoPublicacion) {
    return apiClient.get(`/publicacionMascota/tipo/${tipoPublicacion}`);
}

/**
 * POST PUBLICACIONES
 * @param {object} publicationData - Datos de la publicación a crear
 * @returns {Promise<AxiosResponse<any>>}
 */
export function postPublicacion(publicationData) {
    return apiClient.post('/publicacionMascota', publicationData);
}

/**
 * POST foto posteo de mascota
 * @param {FormData} photoData - Datos de la foto (usualmente FormData)
 * @returns {Promise<AxiosResponse<any>>}
 * @description Podría necesitar headers específicos ('Content-Type': 'multipart/form-data') si no los configura el interceptor globalmente para FormData.
 */
export function postFotoPosteo(photoData) {
    // Si photoData es FormData, Axios usualmente pone el Content-Type correcto.
    // Si no, puedes añadirlo: return apiClient.post('/publicacionMascotaFoto', photoData, { headers: {'Content-Type': 'multipart/form-data'} });
    return apiClient.post('/publicacionMascotaFoto', photoData);
}

/**
 * UPDATE PUBLICACIONES
 * @param {string} id - ID de la publicación a actualizar
 * @param {object} publicationData - Datos (parciales o completos) para actualizar
 * @returns {Promise<AxiosResponse<any>>}
 * @description Se eliminó el fetch previo. Asume que el backend maneja la actualización.
 */
export function updatePost(id, publicationData) {
    return apiClient.put(`/publicacionMascota/${id}`, publicationData);
}

/**
 * ELIMINAR PUBLICACION
 * @param {string} publicationId - ID de la publicación a eliminar
 * @returns {Promise<AxiosResponse<any>>}
 */
export function deletePost(publicationId) {
    return apiClient.delete(`/publicacionMascota/${publicationId}`);
}

/**
 * ELIMINAR foto posteo de mascota
 * @param {string} photoId - ID de la foto a eliminar
 * @returns {Promise<AxiosResponse<any>>}
 */
export function deleteFotoPosteo(photoId) {
    return apiClient.delete(`/publicacionMascotaFoto/${photoId}`);
}