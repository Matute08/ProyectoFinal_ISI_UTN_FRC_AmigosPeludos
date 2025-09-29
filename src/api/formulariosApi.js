import apiClient from "./apiClient";
// Obtener datos de la publicación por ID
export const getPublicacionPorId = async (id) => {
  try {
    const response = await apiClient.get(`/publicacionMascota/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener publicación por ID:", error);
    throw error;
  }
};

export const getFormulariosDuenoPosteo = async (idUsuarioSolicitado) => {
  try {
    const response = await apiClient.get(`/formularioAdopcions/usuarioSolicitado/${idUsuarioSolicitado}`);
    return response;
  } catch (error) {
    console.error("Error al obtener Formulario:", error);
    return { data: null };
  }
};


export const getFormularios = async (params) => {
  try {
    const response = await apiClient.get('/formularioAdopcions', { params });
    return response;
  } catch (error) {
    console.error("Error al obtener Formulario:", error);
    return { data: null };
  }
};

export const getFormulariosId = async (id) => {
  try {
    const response = await apiClient.get(`/formularioAdopcions/${id}`);
    return response;
  } catch (error) {
    console.error("Error al obtener Formulario:", error);
    return { data: null };
  }
};


export const getEstadosFormularios = async () => {
  try {
    const response = await apiClient.get('/estadoFormularios');
    return response;
  } catch (error) {
    console.error("Error al obtener Formulario:", error);
    return { data: null };
  }
};

export const getFormulariosPosibleAdoptante = async (idUsuarioSolicitante) => {
  try {
    const response = await apiClient.get(`/formularioAdopcions/usuarioSolicitante/${idUsuarioSolicitante}`);
    return response;
  } catch (error) {
    console.error("Error al obtener Formulario:", error);
    return { data: null };
  }
};


export const updateForm = async (id, formData) => {
  try {
    const response = await apiClient.put(`/formularioAdopcions/${id}`, formData);
    
    return response;
  } catch (error) {
    console.error("Error al actualizar formulario:", error);
    return { data: null };
  }
};


// Enviar formulario de adopción
export const postFormularioAdopcion = async (adoptionFormData) => {
  try {
    const response = await apiClient.post('/formularioAdopcions', adoptionFormData);
    return response;
  } catch (error) {
    console.error("Error al enviar formulario de adopción:", error);
    throw error;
  }
};
