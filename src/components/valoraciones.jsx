import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Rating,
  TextField,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAuth } from "../auth/AuthProvider";
import {
  getValoracionesPorCuidador,
  getValoracionesPorPaseador,
  postValoracion,
  putValoracion,
  deleteValoracion,
  putRespuestaValoracion,

  eliminarRespuestaValoracion  
} from "../api/valoracionesApi";
import PromedioValoracion from "./PromedioValoracion";
import { mostrarAlertaExito, mostrarAlertaError } from "../utils/showAlert";
import { useUserData } from "../hooks/useUserData";

const Valoraciones = ({ idCuidador = null, idPaseador = null, idUsuarioPerfil = null }) => {
  const { user } = useAuth();
  const { userData, loading: loadingUsuario, getUserId, hasValidUserData } = useUserData();
  const [lista, setLista] = useState([]);
  const [puntaje, setPuntaje] = useState(0);
  const [comentario, setComentario] = useState("");
  const [loadingValoraciones, setLoadingValoraciones] = useState(true);
  const [editando, setEditando] = useState(false);
  const [valoracionEditada, setValoracionEditada] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuValoracionId, setMenuValoracionId] = useState(null);
  const [respuestas, setRespuestas] = useState({}); // Estado para respuestas
  const [mostrarCajaRespuesta, setMostrarCajaRespuesta] = useState({}); // Control de cajas de respuesta
  const open = Boolean(anchorEl);

  // Cargar valoraciones
  useEffect(() => {
    const cargarValoraciones = async () => {
      if (!idCuidador && !idPaseador) {
        setLista([]);
        setLoadingValoraciones(false);
        return;
      }
      try {
        setLoadingValoraciones(true);
        const response = idCuidador
          ? await getValoracionesPorCuidador(idCuidador)
          : await getValoracionesPorPaseador(idPaseador);
        const valoraciones = response.data || [];
        setLista(valoraciones);

        // Inicializar respuestas
        const initRespuestas = {};
        valoraciones.forEach(v => {
          initRespuestas[v.id] = v.respuesta || "";
        });
        setRespuestas(initRespuestas);
      } catch (error) {
        console.error("Error cargando valoraciones:", error);
        setLista([]);
      } finally {
        setLoadingValoraciones(false);
      }
    };
    cargarValoraciones();
  }, [idCuidador, idPaseador]);

  // Enviar o editar valoración
  const handleEnviar = async () => {
    if (!user || !hasValidUserData()) {
      mostrarAlertaError("No se pudo obtener la información del usuario");
      return;
    }

    if (puntaje === 0 || !comentario?.trim()) {
      mostrarAlertaError("Todos los campos son solicitados");
      return;
    }

    const userId = getUserId();
    if (!userId) {
      mostrarAlertaError("No se pudo obtener el ID del usuario");
      return;
    }

    const nuevaValoracion = {
      id: valoracionEditada?.id || 0,
      idUsuario: userId,
      idCuidador: idCuidador || null,
      idPaseador: idPaseador || null,
      puntaje,
      opinion: comentario,
    };

    try {
      let res;
      if (editando) {
        res = await putValoracion(nuevaValoracion);
        const valoracionActualizada = {
          ...res.data,
          nombreUsuario: userData?.nombreCompleto,
        };
        setLista(prev => prev.map(v => v.id === valoracionActualizada.id ? valoracionActualizada : v));
        setEditando(false);
        setValoracionEditada(null);
      } else {
        res = await postValoracion(nuevaValoracion);
        setLista(prev => [
          { ...(res.data || res), nombreUsuario: userData?.nombreCompleto },
          ...prev,
        ]);
      }
      setPuntaje(0);
      setComentario("");
      mostrarAlertaExito(editando ? "Valoración actualizada correctamente" : "Valoración enviada correctamente");
    } catch (error) {
      console.error(error);
      mostrarAlertaError("Error al enviar valoración");
    }
  };

  // Eliminar valoración
  const handleEliminar = async (valoracionId) => {
    try {
      await deleteValoracion(valoracionId);
      setLista(prev => prev.filter(v => v.id !== valoracionId));
      mostrarAlertaExito("Valoración eliminada correctamente");
    } catch (error) {
      console.error(error);
      mostrarAlertaError("Error al eliminar la valoración");
    } finally {
      handleCloseMenu();
    }
  };

  // Editar valoración
  const handleEditarClick = (valoracion) => {
    setEditando(true);
    setValoracionEditada(valoracion);
    setPuntaje(valoracion.puntaje);
    setComentario(valoracion.opinion || valoracion.comentario || "");
    handleCloseMenu();
  };

  const handleOpenMenu = (event, valoracionId) => {
    setAnchorEl(event.currentTarget);
    setMenuValoracionId(valoracionId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuValoracionId(null);
  };

  // Guardar respuesta con validación de ID
  const handleGuardarRespuesta = async (valoracionId) => {
  const respuesta = respuestas[valoracionId]?.trim();

  if (!valoracionId) {
    mostrarAlertaError("No se pudo obtener el ID de la valoración");
    return;
  }

  if (!respuesta) {
    mostrarAlertaError("La respuesta no puede estar vacía");
    return;
  }

  try {
    const res = await putRespuestaValoracion(valoracionId, respuesta);
    setLista(prev =>
      prev.map(v =>
        v.id === valoracionId
          ? { ...v, respuesta: res.data.respuesta, fechaRespuesta: res.data.fechaRespuesta }
          : v
      )
    );
    mostrarAlertaExito("Respuesta guardada correctamente");
    setMostrarCajaRespuesta(prev => ({ ...prev, [valoracionId]: false }));
  } catch (error) {
    console.error(error);
    mostrarAlertaError("No se pudo guardar la respuesta");
  }
};

  //Editar respuesta
  const handleEditarRespuesta = (valoracion) => {
    setRespuestas(prev => ({
      ...prev,
      [valoracion.id]: valoracion.respuesta || ""
    }));
    setMostrarCajaRespuesta(prev => ({
      ...prev,
      [valoracion.id]: true
    }));
  };


  //Eliminar respuesta
    const handleEliminarRespuesta = async (valoracionId) => {
      try {
        await eliminarRespuestaValoracion(valoracionId);

        // Actualizar lista: borrar respuesta y fechaRespuesta
        setLista((prev) =>
          prev.map((v) =>
            v.id === valoracionId ? { ...v, respuesta: null, fechaRespuesta: null } : v
          )
        );

        // Limpiar el campo de respuesta en el estado local
        setRespuestas((prev) => ({ ...prev, [valoracionId]: "" }));

        mostrarAlertaExito("Respuesta eliminada correctamente");
      } catch (error) {
        console.error(error);
        mostrarAlertaError("Error al eliminar la respuesta");
      } finally {
        handleCloseMenu();
      }
    };



  // Ordenar valoraciones
  const listaOrdenada = React.useMemo(() => {
    const listaPorFecha = [...lista].sort((a, b) => {
      const fechaA = new Date(a.fechaValoracion || a.fecha || 0);
      const fechaB = new Date(b.fechaValoracion || b.fecha || 0);
      return fechaB - fechaA;
    });
    if (!userData) return listaPorFecha;
    const miVal = listaPorFecha.find(v => v.idUsuario === userData.id);
    if (!miVal) return listaPorFecha;
    const otros = listaPorFecha.filter(v => v.id !== miVal.id);
    return [miVal, ...otros];
  }, [lista, userData]);

  // Promedio
  const promedioValoraciones = React.useMemo(() => {
    if (!lista.length) return 0;
    return lista.reduce((acc, val) => acc + val.puntaje, 0) / lista.length;
  }, [lista]);

  // Verificar si el usuario logueado es el dueño del perfil
  const esElMismoUsuario = React.useMemo(() => {
    if (!hasValidUserData() || !idUsuarioPerfil) return false;
    const userId = getUserId();
    return userId === idUsuarioPerfil;
  }, [userData, idUsuarioPerfil, hasValidUserData, getUserId]);

  return (
    <Box mt={3}>
      {/* Formulario para calificar */}
      {userData && !esElMismoUsuario && (
        <>
          <Typography variant="h6" fontWeight={600} mb={2}>
            {editando ? "Editar tu valoración" : "Calificar y opinar"}
          </Typography>
          <Rating value={puntaje} onChange={(e, newVal) => setPuntaje(newVal)} size="large" />
          <TextField
            multiline
            fullWidth
            rows={3}
            placeholder="Cuéntales a otros tu experiencia"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Box display="flex" gap={2} mt={2}>
            <Button
              variant="contained"
              onClick={handleEnviar}
              disabled={puntaje === 0 || !comentario?.trim()}
            >
              {editando ? "Guardar cambios" : "Enviar valoración"}
            </Button>
            {editando && (
              <Button
                variant="outlined"
                onClick={() => {
                  setEditando(false);
                  setComentario("");
                  setPuntaje(0);
                  setValoracionEditada(null);
                }}
              >
                Cancelar
              </Button>
            )}
          </Box>
        </>
      )}

      {esElMismoUsuario && (
        <Typography variant="body2" color="text.secondary" mb={2}>
          No puedes calificarte a ti mismo.
        </Typography>
      )}

      {/* Resumen de valoraciones */}
      <Box mt={4}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Resumen de valoraciones
        </Typography>
        {lista.length === 0 ? (
          <Typography variant="body2" color="text.secondary">Aún no hay valoraciones.</Typography>
        ) : (
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Typography variant="h4" color="text.primary" fontWeight="700">
              {promedioValoraciones.toFixed(1)}
            </Typography>
            <PromedioValoracion promedio={promedioValoraciones} size="medium" />
          </Box>
        )}
      </Box>

      {/* Valoraciones */}
      <Box mt={2}>
        <Typography variant="h6" fontWeight={600} mb={2}>Opiniones de usuarios</Typography>
        {loadingValoraciones ? (
          <Typography>Cargando...</Typography>
        ) : listaOrdenada.length === 0 ? (
          <Typography variant="body1" color="text.secondary">Aún no tiene valoraciones.</Typography>
        ) : (
          listaOrdenada.map((val) => {
            const esMia = val.idUsuario === userData?.id;
            const fechaFormateada = val.fechaValoracion
              ? new Date(val.fechaValoracion).toLocaleDateString("es-AR")
              : "";
            const puedeResponder = esElMismoUsuario && !esMia && !val.respuesta;

            return (
              <Box key={val.id} mb={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2" fontWeight="bold">
                    {val.nombreUsuario || "Anónimo"}
                  </Typography>
                  {esMia && (
                    <>
                      <IconButton onClick={(e) => handleOpenMenu(e, val.id)}>
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={menuValoracionId === val.id && open}
                        onClose={handleCloseMenu}
                      >
                        <MenuItem onClick={() => handleEditarClick(val)}>✏️ Editar</MenuItem>
                        <MenuItem onClick={() => handleEliminar(val.id)}>🗑️ Eliminar</MenuItem>
                      </Menu>
                    </>
                  )}
                </Box>

                <Box display="flex" flexDirection="column" alignItems="flex-start" sx={{ mb: 0.5 }}>
                  {fechaFormateada && <Typography variant="caption" color="text.secondary" sx={{ mb: 0.3 }}>{fechaFormateada}</Typography>}
                  <Rating value={val.puntaje} readOnly precision={0.5} size="small" />
                </Box>

                <Typography variant="body2">{val.opinion || val.comentario}</Typography>

                {/* Responder */}
                {puedeResponder && (
                  <Box mt={1} display="flex" flexDirection="column" alignItems="flex-end">
                    {!mostrarCajaRespuesta[val.id] ? (
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => setMostrarCajaRespuesta(prev => ({ ...prev, [val.id]: true }))}
                      >
                        Responder
                      </Button>
                    ) : (
                      <>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          placeholder="Responder a esta valoración"
                          value={respuestas[val.id] || ""}
                          onChange={(e) => setRespuestas(prev => ({ ...prev, [val.id]: e.target.value }))}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ mt: 1, alignSelf: "flex-end" }}
                          onClick={() => handleGuardarRespuesta(val.id)}
                        >
                          Guardar respuesta
                        </Button>
                      </>
                    )}
                  </Box>
                )}

                {/* Mostrar respuesta si existe */}
                {val.respuesta && (
                <Box mt={1} p={1} bgcolor="#f5f5f5" borderRadius={1}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" fontWeight="bold">Respuesta:</Typography>

                    {esElMismoUsuario && !esMia && (
                      <>
                        <IconButton onClick={(e) => handleOpenMenu(e, val.id)}>
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={menuValoracionId === val.id && open}
                          onClose={handleCloseMenu}
                        >
                          <MenuItem onClick={() => handleEditarRespuesta(val)}>✏️ Editar</MenuItem>
                          <MenuItem onClick={() => handleEliminarRespuesta(val.id)}>🗑️ Eliminar</MenuItem>
                        </Menu>
                      </>
                    )}
                  </Box>

                  {/* 📅 Fecha de respuesta debajo del título */}
                  {val.fechaRespuesta && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block" }}
                    >
                      {new Date(val.fechaRespuesta).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </Typography>
                  )}

                  {/* ✏️ Modo edición */}
                  {mostrarCajaRespuesta[val.id] ? (
                    <>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={respuestas[val.id] || ""}
                        onChange={(e) =>
                          setRespuestas((prev) => ({ ...prev, [val.id]: e.target.value }))
                        }
                        sx={{ mt: 1 }}
                      />
                      <Box display="flex" gap={1} justifyContent="flex-end" mt={1}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleGuardarRespuesta(val.id)}
                        >
                          Guardar
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            setMostrarCajaRespuesta((prev) => ({ ...prev, [val.id]: false }))
                          }
                        >
                          Cancelar
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {val.respuesta}
                    </Typography>
                  )}
                </Box>
              )}


                <Divider sx={{ mt: 1 }} />
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default Valoraciones;
