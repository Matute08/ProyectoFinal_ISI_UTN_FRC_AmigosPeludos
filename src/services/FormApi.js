// src/services/FormApi.js
// RECOMENDACIÓN: Renombrar este archivo a algo más específico como AdoptionFormApi.js
import apiClient from './apiClient';

/**
 * GET FORMULARIOS dueño del posteo (Solicitudes recibidas)
 * @param {string} idUsuarioSolicitado - ID del usuario dueño del posteo
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getFormulariosDuenoPosteo(idUsuarioSolicitado) {
    return apiClient.get(`/formularioAdopcions/usuarioSolicitado/${idUsuarioSolicitado}`);
}

/**
 * GET FORMULARIOS persona que quiere adoptar (Solicitudes enviadas)
 * @param {string} idUsuarioSolicitante - ID del usuario que envió la solicitud
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getFormulariosPosibleAdoptante(idUsuarioSolicitante) {
    return apiClient.get(`/formularioAdopcions/usuarioSolicitante/${idUsuarioSolicitante}`);
}

/**
 * GET FORMULARIOS con ID
 * @param {string} id - ID del formulario de adopción
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getFormulariosId(id) {
    return apiClient.get(`/formularioAdopcions/${id}`);
}

/**
 * GET Todos los FORMULARIOS (¿Necesario? Podría devolver muchos datos)
 * @param {object} params - Opcional: objeto con parámetros de query para filtrar/paginar
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getFormularios(params) {
    return apiClient.get('/formularioAdopcions', { params });
}

/**
 * GET estados FORMULARIOS (Obtiene los posibles estados: pendiente, aprobado, rechazado, etc.)
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getEstadosFormularios() {
    return apiClient.get('/estadoFormularios');
}

/**
 * UPDATE ESTADO FORMULARIO (Actualiza un formulario, probablemente su estado)
 * @param {string} id - ID del formulario a actualizar
 * @param {object} formData - Datos a actualizar (ej. { estadoId: 2 })
 * @returns {Promise<AxiosResponse<any>>}
 * @description Se eliminó el fetch previo. Asume que el backend maneja la actualización.
 */
export function updateForm(id, formData) {
    // Considera usar PATCH si solo actualizas el estado: apiClient.patch(`/formularioAdopcions/${id}`, formData)
    return apiClient.put(`/formularioAdopcions/${id}`, formData);
}

/**
 * POST FORMULARIO ADOPCIÓN
 * @param {object} adoptionFormData - Datos del formulario a crear
 * @returns {Promise<AxiosResponse<any>>}
 */
export function postFormularioAdopcion(adoptionFormData) {
    return apiClient.post('/formularioAdopcions', adoptionFormData);
}