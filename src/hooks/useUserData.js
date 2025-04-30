// src/hooks/useUserData.js
import { useState, useEffect } from 'react';
// Asegúrate de que la ruta a tu API sea correcta
import { getUserMail } from '../services/userApi'; // <--- Importa tu función API

export function useUserData() {
    const [userData, setUserData] = useState(null); // Inicializa como null
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            setError(null);
            setUserData(null); // Resetea userData al iniciar la carga

            try {
                // 1. Obtener los datos del usuario desde el localStorage
                const cachedUserDataString = localStorage.getItem('userData');

                if (cachedUserDataString) {
                    // 2. Parsear los datos almacenados
                    const dataLocalStorage = JSON.parse(cachedUserDataString);

                    // 3. Acceder al correo electrónico
                    const userEmail = dataLocalStorage?.email; // Usa optional chaining por seguridad

                    if (userEmail) {
                        // 4. Llamar a la API para obtener detalles
                        const response = await getUserMail(userEmail);

                        // 5. Procesar la respuesta de la API
                        if (response && response.data) {
                            const detailedUserData = response.data;

                            // Realiza la transformación que hacías antes (combinar calle y nro)
                            // Es buena idea verificar que las propiedades existan
                            if (detailedUserData.calle && detailedUserData.nroCalle) {
                                detailedUserData.direccionCompleta = `${detailedUserData.calle} ${detailedUserData.nroCalle}`;
                                // Opcional: mantener el campo original modificado si lo prefieres
                                // detailedUserData.calle = `${detailedUserData.calle} ${detailedUserData.nroCalle}`;
                            } else {
                                detailedUserData.direccionCompleta = detailedUserData.calle || ''; // O alguna lógica por defecto
                            }


                            setUserData(detailedUserData);
                        } else {
                            // La API no devolvió datos válidos
                            console.warn("No detailed user data received from API for email:", userEmail);
                            setError(new Error('No se pudieron obtener los detalles del usuario.'));
                        }
                    } else {
                        // No se encontró el email en localStorage
                        console.warn("User email not found in localStorage data.");
                        setError(new Error('Email de usuario no encontrado localmente.'));
                        // Considera si debes limpiar localStorage aquí o manejarlo en el login/logout
                    }
                } else {
                    // No hay datos del usuario en localStorage
                    console.warn("No user data found in localStorage ('userData' item).");
                    // Esto puede ser normal si el usuario no está logueado
                    // setError(new Error('Usuario no autenticado localmente.'));
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError(err); // Guarda el objeto de error
            } finally {
                // 6. Finalizar el estado de carga
                setIsLoading(false);
            }
        };

        fetchUserData();
        // Se ejecuta solo una vez al montar el componente que lo use
    }, []); // Array de dependencias vacío

    // Devuelve el estado y los datos
    return { userData, isLoading, error };
}