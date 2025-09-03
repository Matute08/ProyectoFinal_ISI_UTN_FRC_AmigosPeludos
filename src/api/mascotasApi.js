import apiClient from "./apiClient";


// Obtener todas las razas por tipo de mascota
export const getRazasPorTipo = async (tipoId) => {
  try {
    const response = await apiClient.get(`/raza/tipomascota/${tipoId}`);
    return response;
  } catch (error) {
    console.error("Error al obtener razas:", error);
    return { data: [] };
  }
};

// Obtener una raza por su ID
export const getRazaById = async (razaId) => {
  try {
    const response = await apiClient.get(`/raza/${razaId}`);
    return response;
  } catch (error) {
    console.error("Error al obtener raza por ID:", error);
    return { data: null };
  }
};


// Obtener todas las mascotas de un usuario
export const getMascotasUsuario = async (userId) => {
  try {
    const response = await apiClient.get(`/mascotaFull/usuario/${userId}`);
    return response;
  } catch (error) {
    console.error("API: Error al obtener mascotas:", error);
    console.error("API: Detalles del error:", error.response?.data);
    return { data: [] };
  }
};

// Eliminar una mascota
export const deletePet = async (petId) => {
  try {
    const response = await apiClient.delete(`/mascota/${petId}`);
    return response;
  } catch (error) {
    console.error("Error al eliminar mascota:", error);
    return { data: null };
  }
};

// Obtener una mascota por su ID
export const getMascotaId = async (id) => {
  try {
    const response = await apiClient.get(`/mascotaFull/${id}`);
    return response;
  } catch (error) {
    console.error("Error al obtener mascota por ID:", error);
    return { data: null };
  }
};

export const updatePets = async (idPet, dataPet) => {
  try {
    // Obtener los datos actuales
    const res = await getMascotaId(idPet);
    const existingPet = res?.data;

    // Combinar datos (si querés preservar otros campos)
    const updatedPetData = {
      ...existingPet,
      ...dataPet,
    };

    // Enviar PUT al endpoint correcto
    const response = await apiClient.put(`/mascota/${idPet}`, updatedPetData);
    return response;
  } catch (error) {
    console.error("Error al actualizar mascota:", error);
    return { data: null };
  }
};


// Agregar una mascota
export const postMascota = async (petData) => {
  try {
    const response = await apiClient.post("/mascota", petData);
    return response;
  } catch (error) {
    console.error("Error al publicar mascota:", error);
    return { data: null };
  }
};