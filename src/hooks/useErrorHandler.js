import { useState, useCallback } from 'react';

export const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const handleError = useCallback((err, context = '') => {
    console.error(`Error en ${context}:`, err);
    
    let errorInfo = {
      type: 'unknown',
      message: 'Ha ocurrido un error inesperado',
      details: err.message || 'Error desconocido',
      showError404: false
    };

    // Manejo de errores HTTP
    if (err.response) {
      const status = err.response.status;
      
      switch (status) {
        case 400:
          errorInfo = {
            type: 'bad_request',
            message: 'Solicitud incorrecta',
            details: 'Los datos enviados no son válidos',
            showError404: false
          };
          break;
          
        case 401:
          errorInfo = {
            type: 'unauthorized',
            message: 'No autorizado',
            details: 'Necesitas iniciar sesión para acceder a este recurso',
            showError404: false
          };
          break;
          
        case 403:
          errorInfo = {
            type: 'forbidden',
            message: 'Acceso prohibido',
            details: 'No tienes permisos para acceder a este recurso',
            showError404: false
          };
          break;
          
        case 404:
          errorInfo = {
            type: 'not_found',
            message: 'Recurso no encontrado',
            details: 'El elemento que buscas no existe o ha sido eliminado',
            showError404: true
          };
          break;
          
        case 500:
          errorInfo = {
            type: 'server_error',
            message: 'Error del servidor',
            details: 'Ha ocurrido un error interno. Intenta más tarde',
            showError404: false
          };
          break;
          
        default:
          errorInfo = {
            type: 'http_error',
            message: `Error ${status}`,
            details: err.response.data?.message || 'Error en la comunicación con el servidor',
            showError404: false
          };
      }
    }
    
    // Manejo de errores de Firebase
    else if (err.code && err.code.startsWith('auth/')) {
      switch (err.code) {
        case 'auth/user-not-found':
          errorInfo = {
            type: 'auth_error',
            message: 'Usuario no encontrado',
            details: 'No existe una cuenta con estas credenciales',
            showError404: false
          };
          break;
          
        case 'auth/wrong-password':
          errorInfo = {
            type: 'auth_error',
            message: 'Contraseña incorrecta',
            details: 'La contraseña ingresada no es válida',
            showError404: false
          };
          break;
          
        case 'auth/invalid-email':
          errorInfo = {
            type: 'auth_error',
            message: 'Email inválido',
            details: 'El formato del correo electrónico no es válido',
            showError404: false
          };
          break;
          
        default:
          errorInfo = {
            type: 'auth_error',
            message: 'Error de autenticación',
            details: err.message || 'Error al procesar la autenticación',
            showError404: false
          };
      }
    }
    
    // Manejo de errores de red
    else if (err.message && err.message.includes('Network Error')) {
      errorInfo = {
        type: 'network_error',
        message: 'Error de conexión',
        details: 'No se pudo conectar con el servidor. Verifica tu conexión a internet',
        showError404: false
      };
    }
    
    // Manejo de errores de timeout
    else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      errorInfo = {
        type: 'timeout_error',
        message: 'Tiempo de espera agotado',
        details: 'La solicitud tardó demasiado en responder. Intenta nuevamente',
        showError404: false
      };
    }

    setError(errorInfo);
    return errorInfo;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
    isError404: error?.showError404 || false
  };
};
