// hooks/useApplications.js
import { useState, useEffect } from 'react';

export function useApplications(fetchFunction, userId) {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Solo ejecuta si userId es válido (o si no se requiere userId)
        if (!userId) {
            // Decide si debes poner isLoading en false o esperar un userId
             setIsLoading(false); // Opcional: si no hay user, no hay nada que cargar
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetchFunction();
                // Ordenar datos aquí si es consistente
                const sortedData = response.data.sort((a, b) => {
                    // Lógica de ordenamiento (Revisión primero, luego fecha)
                    const isARevision = a.estado === "Revision" || a.estadoId === 1; // Ajusta según tu data
                    const isBRevision = b.estado === "Revision" || b.estadoId === 1;
                    if (isARevision && !isBRevision) return -1;
                    if (!isARevision && isBRevision) return 1;
                    return new Date(b.fechaAlta) - new Date(a.fechaAlta);
                });
                setApplications(sortedData);
            } catch (err) {
                console.error(`Error fetching applications:`, err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchFunction, userId]); // Depende de la función y userId

    // Podrías añadir una función para refrescar los datos si es necesario
    // const refreshApplications = useCallback(() => { /* ... fetchData()... */ }, [fetchFunction, userId]);

    return { applications, isLoading, error /*, refreshApplications */ };
}