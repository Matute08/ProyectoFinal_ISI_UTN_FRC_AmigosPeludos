import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { getUserMail } from '../api/userApi';

/**
 * Hook personalizado para manejar los datos del usuario de manera robusta
 * Evita errores cuando userData es null o undefined
 */
export const useUserData = () => {
  const { user, userData: authUserData } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Primero intentar usar los datos del contexto de autenticación
        if (authUserData && (authUserData.id || authUserData.data?.id)) {
          setUserData(authUserData);
          setLoading(false);
          return;
        }
        
        // Si no hay datos del contexto, intentar cargar desde localStorage
        const local = localStorage.getItem("userData");
        if (!local) {
          setUserData(null);
          setLoading(false);
          return;
        }
        
        let localData;
        try {
          localData = JSON.parse(local);
        } catch (parseError) {
          console.error("Error al parsear userData del localStorage:", parseError);
          localStorage.removeItem("userData");
          setUserData(null);
          setLoading(false);
          return;
        }
        
        // Buscar email en diferentes campos posibles
        const email = localData?.email || localData?.mail || localData?.user?.email || localData?.user?.mail;
        
        if (!email || typeof email !== 'string') {
          console.warn("No se encontró email válido en userData:", localData);
          setUserData(null);
          setLoading(false);
          return;
        }
        
        // Intentar cargar datos frescos del backend
        const res = await getUserMail(email);
        if (res && (res.id || res.data?.id)) {
          setUserData(res);
          // Actualizar localStorage con datos frescos
          localStorage.setItem("userData", JSON.stringify(res));
        } else {
          // Si no se pueden cargar los datos del backend, usar los datos del localStorage
          setUserData(localData);
        }
      } catch (error) {
        console.error("Error cargando usuario backend:", error);
        setError(error);
        
        // En caso de error, intentar usar datos del localStorage como fallback
        try {
          const local = localStorage.getItem("userData");
          if (local) {
            const localData = JSON.parse(local);
            setUserData(localData);
          } else {
            setUserData(null);
          }
        } catch (fallbackError) {
          console.error("Error en fallback de localStorage:", fallbackError);
          setUserData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [authUserData]);

  // Función para obtener el ID del usuario de manera segura
  const getUserId = () => {
    if (!userData) return null;
    return userData.id || userData.data?.id || null;
  };

  // Función para verificar si el usuario tiene datos válidos
  const hasValidUserData = () => {
    return userData && getUserId() !== null;
  };

  // Función para refrescar los datos del usuario
  const refreshUserData = async () => {
    if (!user?.email) return;
    
    try {
      const data = await getUserMail(user.email);
      if (data) {
        setUserData(data);
        localStorage.setItem("userData", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error al refrescar datos del usuario:", error);
      setError(error);
    }
  };

  return {
    userData,
    loading,
    error,
    getUserId,
    hasValidUserData,
    refreshUserData
  };
};
