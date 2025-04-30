// src/utils/dateUtils.js

/**
 * Formatea una cadena de fecha o un objeto Date a DD/MM/YYYY.
 * @param {string | Date} dateString - La fecha a formatear.
 * @returns {string} - La fecha formateada o una cadena vacía si la entrada es inválida.
 */
export const formatDate = (dateString) => {
    if (!dateString) return ''; // Maneja fechas nulas o indefinidas
    try {
        const date = new Date(dateString);
        // Verifica si la fecha es válida
        if (isNaN(date.getTime())) {
            console.warn("Invalid date provided to formatDate:", dateString);
            return 'Fecha inválida';
        }
        const day = date.getDate();
        const month = date.getMonth() + 1; // Los meses son indexados desde 0
        const year = date.getFullYear();
        return `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
    } catch (error) {
        console.error("Error formatting date:", error);
        return 'Error fecha'; // O maneja el error como prefieras
    }
};