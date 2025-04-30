// src/services/userApi.js
import apiClient from './apiClient';

/**
 * GET USUARIO (¿Todos los usuarios? Cuidado con la cantidad de datos)
 * @param {object} params - Opcional: objeto con parámetros de query para filtrar/paginar
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getUser(params) {
    return apiClient.get('/usuario', { params });
}

/**
 * GET ROL (Todos los roles posibles)
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getRol() {
    return apiClient.get('/rols'); // ¿Quizás debería ser /roles? Verifica tu endpoint
}

/**
 * GET USUARIO POR ID
 * @param {string} id - ID del usuario
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getUserId(id) {
    return apiClient.get(`/usuario/${id}`);
}

/**
 * GET USUARIO POR MAIL (con datos completos)
 * @param {string} mail - Email del usuario
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getUserMail(mail) {
    return apiClient.get(`/usuarioFull/email/${encodeURIComponent(mail)}`);
}

/**
 * GET USUARIO COMPLETO (¿Usuario actual por token? ¿O todos con email?) - Endpoint `/usuario/mail` es ambiguo
 * @description Revisa qué hace exactamente este endpoint. Si es obtener el usuario actual, usa '/usuario/me' (o similar).
 * Si es buscar por email, `getUserMail` ya existe. Si es obtener *todos* los usuarios con su email, podría ser igual a `getUser`.
 * Por ahora, lo dejo apuntando a '/usuario/mail' como en tu código original.
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getUsuarioCompleto() {
    return apiClient.get('/usuario/mail'); // Revisa este endpoint
}

/**
 * ACTUALIZAR USUARIO
 * @param {string} id - ID del usuario a actualizar
 * @param {object} userData - Datos (parciales o completos) a actualizar
 * @returns {Promise<AxiosResponse<any>>}
 * @description Se eliminó el fetch previo. Asume que el backend maneja la actualización.
 */
export function updateUser(id, userData) {
    return apiClient.put(`/usuario/${id}`, userData);
}

/**
 * UPDATE qr USUARIO
 * @param {string} id - ID del usuario
 * @param {object | string} qrData - Datos del QR (podría ser un objeto o solo la string del QR)
 * @returns {Promise<AxiosResponse<any>>}
 */
export function updateQrUsuario(id, qrData) {
    // Ajusta el tipo de dato según lo que espere tu API
    return apiClient.put(`/usuario/qr/${id}`, qrData); // Originalmente pasabas solo 'qr', asumo que era la variable con los datos.
}

/**
 * POST USUARIO (Registro normal o con Google)
 * @param {object} userData - Datos del usuario a crear
 * @returns {Promise<AxiosResponse<any>>}
 */
export function postUser(userData) {
    // postUserWithGoogle era idéntica, así que se elimina y se usa solo esta.
    return apiClient.post('/usuario', userData);
}