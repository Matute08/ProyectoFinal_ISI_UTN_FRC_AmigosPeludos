// src/utils/swalHelpers.js
import Swal from 'sweetalert2';

/**
 * Muestra un diálogo de SweetAlert2 para confirmar y actualizar el estado de una entidad.
 * @param {string} entityTypeName - Nombre singular de la entidad (ej: "fundación", "veterinaria").
 * @param {string | number} entityId - ID de la entidad a actualizar.
 * @param {string} entityName - Nombre descriptivo de la entidad (para el título).
 * @param {Array<{id: number, nombre: string}>} statuses - Array de objetos de estado disponibles (ej: [{id: 1, nombre: 'Revisión'}, ...]).
 * @param {Function} updateFunction - La función async que llama a la API para actualizar el estado (ej: updateEstadoFundacion). Debe aceptar (id, { estadoId }).
 */
export const showUpdateStatusDialog = async (entityTypeName, entityId, entityName, statuses, updateFunction) => {
    // Verifica que los estados estén disponibles
    if (!statuses || statuses.length === 0) {
        Swal.fire("Error", "No se pudieron cargar los estados disponibles.", "error");
        return;
    }

    // Crea las opciones para el input 'select' de Swal
    const inputOptions = statuses.reduce((options, estado) => {
        options[estado.id] = estado.nombre;
        return options;
    }, {});

    const { value: selectedEstadoId } = await Swal.fire({
        title: `Actualizar estado: ${entityName || entityTypeName + ' ' + entityId}`,
        text: `Selecciona el nuevo estado para ${entityTypeName}:`,
        input: 'select',
        inputOptions: inputOptions,
        inputPlaceholder: 'Selecciona...',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        // Puedes añadir validación si necesitas que se seleccione algo obligatoriamente
        // inputValidator: (value) => {
        //     if (!value) {
        //         return '¡Necesitas seleccionar un estado!'
        //     }
        // }
    });

    // Si el usuario seleccionó un estado y confirmó
    if (selectedEstadoId) {
        try {
            // Muestra el diálogo de carga
            Swal.fire({
                title: 'Procesando...',
                text: `Actualizando estado de ${entityTypeName}...`,
                icon: 'info',
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const formData = {
                estadoId: parseInt(selectedEstadoId, 10),
            };

            // Llama a la función de actualización proporcionada
            await updateFunction(entityId, formData);

            // Cierra el mensaje de "Cargando"
            Swal.close(); // Cierra explícitamente el loading Swal

            // Muestra el mensaje de éxito
            await Swal.fire({
                title: '¡Actualizado!',
                text: `El estado de ${entityTypeName} ${entityName || entityId} ha sido actualizado correctamente.`,
                icon: 'success',
                timer: 2000, // Cierra automáticamente después de 2 segundos
                timerProgressBar: true,
                showConfirmButton: false,
            });

            // Recarga la página o actualiza el estado local para reflejar el cambio
            // La recarga es simple pero menos eficiente en UX.
            // Considera usar una función de 'refresh' si la pasas al componente tabla.
            window.location.reload();

        } catch (error) {
            console.error(`Error al actualizar el estado de ${entityTypeName}:`, error);
            // Cierra el Swal de carga si todavía está abierto
            Swal.close();
            // Muestra un mensaje de error
            Swal.fire('Error', `Hubo un problema al actualizar el estado: ${error.message || 'Error desconocido'}`, 'error');
        }
    }
};