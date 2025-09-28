import apiClient from "./apiClient";

// Obtener datos del usuario a partir del email
export const getUserMail = async (mail) => {
  // Validar que el email no sea undefined, null o vacío
  if (!mail || mail === 'undefined' || mail === 'null') {
    console.warn('getUserMail: Email inválido proporcionado:', mail);
    return null;
  }
  
  try {
    const response = await apiClient.get(`/usuarioFull/email/${mail}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null; // usuario no existe => se puede registrar
    }
    throw error; // otros errores sí se notifican
  }
};



export const getUserId = async (id) => {
  try {
    const response = await apiClient.get(`/usuarioFull/${id}`);
    return response;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return { data: null };
  }
};

export const getPublicacionesUser = async (email) => {
  try {
    const response = await apiClient.get(`/publicacionMascota/email/${encodeURIComponent(email)}`);
    return response;
  } catch (error) {
    console.error("Error al obtener publicacion:", error);
    return { data: null };
  }
};





export const postNuevoUsuario = async (usuario) => {
  try {
    const response = await apiClient.post("/usuario", usuario);
    return response;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/usuario/${userId}`, userData);
    return response;
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return { data: null };
  }
};


export const deletePost = async (publicacionId) => {
  try {
    const response = await apiClient.delete(`/publicacionMascota/${publicacionId}`);
    return response;
  } catch (error) {
    console.error("Error al eliminar publicacion", error);
    return { data: null };
  }
};