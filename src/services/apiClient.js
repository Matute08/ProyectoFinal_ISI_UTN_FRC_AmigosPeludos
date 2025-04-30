import axios from 'axios';

// Crea una instancia de Axios con configuración base
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Lee la URL base del .env
  headers: {
    'Content-Type': 'application/json',
    // Podrías añadir otros headers por defecto si son necesarios
  },
});

// --- Interceptores (Opcional pero MUY recomendado) ---

// 1. Interceptor para añadir el token de autenticación a las peticiones
apiClient.interceptors.request.use(
  (config) => {
    // Intenta obtener el token (ajusta cómo lo almacenas: localStorage, sessionStorage, etc.)
    // Si usas Firebase Auth, podrías obtener el idToken del usuario actual
    // import { auth } from './Firebase'; // Importa tu instancia de auth
    // const user = auth.currentUser;
    // if (user) {
    //   const token = await user.getIdToken(); // getIdToken es asíncrono! Manejar esto puede ser más complejo aquí.
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    // Alternativa más simple si guardas un token JWT de tu propio backend en localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Interceptor para manejar errores de respuesta globalmente
apiClient.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente la retornamos
    return response;
  },
  (error) => {
    // Manejo de errores específico
    if (error.response) {
      // La petición se hizo y el servidor respondió con un status code fuera del rango 2xx
      console.error('API Error Response:', error.response.data);
      console.error('Status Code:', error.response.status);

      if (error.response.status === 401) {
        // Ejemplo: No autorizado (token inválido/expirado)
        // Podrías limpiar el estado de autenticación y redirigir al login
        // logoutUser(); // Llama a tu función de logout
        // window.location.href = '/login';
        console.error("Usuario no autorizado o sesión expirada. Redirigir a login.");
      }
      // Puedes añadir manejo para otros códigos de error (403, 404, 500, etc.)

    } else if (error.request) {
      // La petición se hizo pero no se recibió respuesta (ej. problema de red)
      console.error('API No Response:', error.request);
    } else {
      // Algo pasó al configurar la petición que lanzó un error
      console.error('API Request Setup Error:', error.message);
    }
    // Rechaza la promesa para que el error pueda ser capturado también localmente si es necesario
    return Promise.reject(error);
  }
);

export default apiClient;