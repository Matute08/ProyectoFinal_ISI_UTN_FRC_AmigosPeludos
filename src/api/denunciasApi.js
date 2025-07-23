import apiClient from "./apiClient";

// Crear una nueva denuncia
export const postDenuncia = (denuncia) =>
  apiClient.post("/denuncias", denuncia);

export const verificarDenuncia = (idUsuario, idPublicacion) =>
  apiClient.get(`/denuncias/existe?idUsuario=${idUsuario}&idPublicacion=${idPublicacion}`);

export const getDenuncias = () => apiClient.get("/denuncias/panel");

