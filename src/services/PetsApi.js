// Este archivo contiene funciones para interactuar con la API relacionada con mascotas y sus metadatos.

import apiClient from "./apiClient"; // Importa la instancia centralizada

// --- Funciones de Mascotas ---

/**
 * GET DATOS DE MASCOTAS CON ID
 * @param {string} id - ID de la mascota
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getMascotaId(id) {
    return apiClient.get(`/mascotaFull/${id}`);
}

/**
 * GET MASCOTAS DE USUARIO
 * @param {string} idUsuario - ID del usuario
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getMascotasUsuario(idUsuario) {
    return apiClient.get(`/mascotaFull/usuario/${idUsuario}`);
}

/**
 * POST MASCOTA
 * @param {object} petData - Datos de la mascota a crear
 * @returns {Promise<AxiosResponse<any>>}
 */
export function postMascota(petData) {
    return apiClient.post("/mascota", petData);
}

/**
 * UPDATE PET
 * @param {string} idPet - ID de la mascota a actualizar
 * @param {object} dataPet - Datos parciales o completos para actualizar
 * @returns {Promise<AxiosResponse<any>>}
 */

export async function updatePets(idPet, dataPet) {
    try {
        // Obtener los datos existentes de la mascota desde la API
        const existingPetData = await getMascotaId(idPet);

        // Combinar los datos existentes y los datos actualizados
        const updatedPetData = {
            ...existingPetData,
            ...dataPet,
        };

        // Realizar la solicitud PUT para actualizar la mascota
        return apiClient.put(`/mascota/${idPet}`, updatedPetData);

    } catch (error) {
        console.log(error);
    }
}

/**
 * ELIMINAR MASCOTA
 * @param {string} petId - ID de la mascota a eliminar
 * @returns {Promise<AxiosResponse<any>>}
 */
export function deletePet(petId) {
    return apiClient.delete(`/mascota/${petId}`);
}

// --- Funciones de Metadatos Relacionados con Mascotas ---

/**
 * GET TIPO MASCOTA
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getTipoMascota() {
    return apiClient.get("/tipoMascota");
}

/**
 * GET TIPO MASCOTA POR ID
 * @param {string} id - ID del tipo de mascota
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getTipoMascotaId(id) {
    return apiClient.get(`/tipoMascota/${id}`);
}

/**
 * GET SEXO MASCOTA
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getSexoMascota() {
    return apiClient.get("/sexoMascota");
}

/**
 * GET EDAD TODAS LAS MASCOTA 
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getAllEdadMascota() {

    return apiClient.get("/edadMascota");
}

/**
 * GET EDAD MASCOTA ID (Tipo de edad por ID)
 * @param {string} id - ID del tipo de edad
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getEdadMascotaId(id) {
    return apiClient.get(`/edadMascota/${id}`);
}
