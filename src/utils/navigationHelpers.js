// src/utils/navigationHelpers.js

/**
 * Abre la página de detalles/formulario para una entidad específica en una nueva pestaña.
 * @param {string} entityTypePrefix - Prefijo para la ruta (ej: "fundacion", "veterinaria").
 * @param {string | number} entityId - El ID de la entidad.
 */
export const openDetailsPage = (entityTypePrefix, entityId) => {
    if (!entityTypePrefix || !entityId) {
        console.error("entityTypePrefix and entityId are required to open details page.");
        return;
    }
    // Ajusta la ruta base según la estructura de tu aplicación
    const url = `/ver-formulario-solicitud-${entityTypePrefix}/${entityId}`;
    const newTab = window.open(url, '_blank');
    if (newTab) {
        newTab.focus();
    } else {
        // Manejo de error si el navegador bloquea pop-ups
        alert('Por favor, permite las ventanas emergentes para ver los detalles.');
    }
};