import apiClient from "./apiClient";

// Crear una nueva denuncia según el tipo de entidad
export const postDenuncia = (denuncia, tipoEntidad) => {
  if (tipoEntidad === "paseador") {
    return apiClient.post("/denuncias/paseador", denuncia);
  } else if (tipoEntidad === "cuidador") {
    return apiClient.post("/denuncias/cuidador", denuncia);
  } else if (tipoEntidad === "fundacion") {
    return apiClient.post("/denuncias/fundacion", denuncia);
  } else if (tipoEntidad === "veterinaria") {
    return apiClient.post("/denuncias/veterinaria", denuncia);
  } else {
    return apiClient.post("/denuncias", denuncia);  // para publicaciones
  }
};

// Verificar si existe denuncia según tipo de entidad
export const verificarDenuncia = (idUsuario, idEntidad, tipoEntidad) => {
  if (tipoEntidad === "paseador") {
    return apiClient.get(
      `/denuncias/existe-paseador?idUsuario=${idUsuario}&idPaseador=${idEntidad}`
    );
  } else if (tipoEntidad === "cuidador") {
    return apiClient.get(
      `/denuncias/existe-cuidador?idUsuario=${idUsuario}&idCuidador=${idEntidad}`
    );
  } else if (tipoEntidad === "fundacion") {
    return apiClient.get(
      `/denuncias/existe-fundacion?idUsuario=${idUsuario}&idFundacion=${idEntidad}`
    );
  } else if (tipoEntidad === "veterinaria") {
    return apiClient.get(
      `/denuncias/existe-veterinaria?idUsuario=${idUsuario}&idVeterinaria=${idEntidad}`
    );
  } else {
    return apiClient.get(
      `/denuncias/existe?idUsuario=${idUsuario}&idPublicacion=${idEntidad}`
    );
  }
};

// Obtener todas las denuncias a publicaciones (mascotas)
export const getDenuncias = () => apiClient.get("/denuncias/panel");

// Obtener todas las denuncias a paseadores
export const getDenunciasPaseadores = () => apiClient.get("/denuncias/panel-paseadores");

// Obtener todas las denuncias a cuidadores
export const getDenunciasCuidadores = () => apiClient.get("/denuncias/panel-cuidadores");
// Obtener todas las denuncias a fundaciones
export const getDenunciasFundaciones = () => apiClient.get("/denuncias/panel-fundaciones");
// Obtener todas las denuncias a veterinarias
export const getDenunciasVeterinarias = () => apiClient.get("/denuncias/panel-veterinarias");

// Aceptar denuncia por id (cambiar estado a 2)
export const aceptarDenuncia = (idDenuncia) => {
  return apiClient.put(`/denuncias/aceptarDenuncia/${idDenuncia}`);
};
export const aceptarDenunciaPaseador = (idDenuncia) => {
  return apiClient.put(`/denuncias/aceptarDenunciaPaseador/${idDenuncia}`);
};
export const aceptarDenunciaCuidador = (idDenuncia) => {
  return apiClient.put(`/denuncias/aceptarDenunciaCuidador/${idDenuncia}`);
};
export const aceptarDenunciaFundacion = (idDenuncia) => {
  return apiClient.put(`/denuncias/aceptarDenunciaFundacion/${idDenuncia}`);
};
export const aceptarDenunciaVeterinaria = (idDenuncia) => {
  return apiClient.put(`/denuncias/aceptarDenunciaVeterinaria/${idDenuncia}`);
};


// Obtener lista de estados desde la tabla estadoDenuncias
export const getEstadosDenuncias = () => apiClient.get("/estadoDenuncias");

// Cambiar estado denuncia publicaciones
export const cambiarEstado = (idDenuncia, nuevoEstado) => {
  return apiClient.put(`/denuncias/cambiarEstado/${idDenuncia}`, nuevoEstado);
};
// Cambiar estado de denuncia de paseador
export const cambiarEstadoDenunciaPaseador = (idDenuncia, nuevoEstado) => {
  return apiClient.put(`/denuncias/cambiarEstadoDenunciaPaseador/${idDenuncia}`, nuevoEstado);
};

// Cambiar estado de denuncia de cuidador
export const cambiarEstadoDenunciaCuidador = (idDenuncia, nuevoEstado) => {
  return apiClient.put(`/denuncias/cambiarEstadoDenunciaCuidador/${idDenuncia}`, nuevoEstado);
};
// Cambiar estado de denuncia de fundacion
export const cambiarEstadoDenunciaFundacion = (idDenuncia, nuevoEstado) => {
  return apiClient.put(`/denuncias/cambiarEstadoDenunciaFundacion/${idDenuncia}`, nuevoEstado);
};
// Cambiar estado de denuncia de fundacion
export const cambiarEstadoDenunciaVeterinaria = (idDenuncia, nuevoEstado) => {
  return apiClient.put(`/denuncias/cambiarEstadoDenunciaVeterinaria/${idDenuncia}`, nuevoEstado);
};


// Deshabilitar publicación (cambiar habilitado a false)
export const deshabilitarPublicacion = (idPublicacion) => {
  return apiClient.put(`/publicacionMascota/deshabilitar/${idPublicacion}`);
};
// Deshabilitar paseador (cambiar habilitado a false)
export const deshabilitarPaseador = (idPaseador) => {
  return apiClient.put(`/paseador/deshabilitar/${idPaseador}`);
};
// Deshabilitar cuidador (cambiar habilitado a false)
export const deshabilitarCuidador = (idCuidador) => {
  return apiClient.put(`/cuidadors/deshabilitar/${idCuidador}`);
};
export const deshabilitarFundacion = (idFundacion) => {
  return apiClient.put(`/fundacion/deshabilitar/${idFundacion}`);
};
export const deshabilitarVeterinaria = (idVeterinaria) => {
  return apiClient.put(`/veterinaria/deshabilitar/${idVeterinaria}`);
};

// Marcar publicación como denuncia desestimada
export const marcarDesestimada = (idPublicacion) => {
  return apiClient.put(`/publicacionMascota/marcarDenunciasDesestimadas/${idPublicacion}`);
};
export const marcarDesestimadaPaseador = (idPaseador) => {
  return apiClient.put(`/paseador/marcarDenunciasDesestimadas/${idPaseador}`);
};
export const marcarDesestimadaCuidador = (idCuidador) => {
  return apiClient.put(`/cuidadors/marcarDenunciasDesestimadas/${idCuidador}`);
};
export const marcarDesestimadaFundacion = (idFundacion) => {
  return apiClient.put(`/fundacion/marcarDenunciasDesestimadas/${idFundacion}`);
};
export const marcarDesestimadaVeterinaria = (idVeterinaria) => {
  return apiClient.put(`/veterinaria/marcarDenunciasDesestimadas/${idVeterinaria}`);
};