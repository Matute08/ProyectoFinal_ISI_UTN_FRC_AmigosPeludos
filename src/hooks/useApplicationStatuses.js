// src/hooks/useApplicationStatuses.js
import { useState, useEffect } from 'react';
// Asegúrate que la ruta a tu API sea correcta
import { getEstadosVeterinaria } from '../services/commonApi'; // <--- ¡Importante! Usa la función API correcta

export function useApplicationStatuses() {
    const [statuses, setStatuses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatuses = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Llama a la función API que obtiene los estados.
                // Según tu código original, 'getEstadosVeterinaria' se usaba para ambos.
                // Si esto es correcto, mantenlo. Si debería haber otra función para
                // fundaciones, necesitarías ajustar la lógica o crear otro hook.
                const response = await getEstadosVeterinaria();

                // Asume que la respuesta tiene un campo 'data' con el array de estados
                if (response && response.data) {
                    setStatuses(response.data);
                } else {
                    // Maneja el caso de una respuesta inesperada
                    console.warn("API response for statuses might be empty or malformed:", response);
                    setStatuses([]);
                    setError(new Error("Respuesta inesperada del servidor al obtener estados."));
                }
            } catch (err) {
                console.error("Error fetching application statuses:", err);
                setError(err);
                setStatuses([]); // Asegura que statuses sea un array vacío en caso de error
            } finally {
                setIsLoading(false);
            }
        };

        fetchStatuses();
        // Este efecto solo se ejecuta una vez al montar el componente
        // que lo usa, ya que no tiene dependencias variables.
    }, []); // Array de dependencias vacío

    return { statuses, isLoading, error };
}