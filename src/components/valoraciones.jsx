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
} from "../api/valoracionesApi";
import { getUserMail } from "../api/userApi";
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
  const open = Boolean(anchorEl);


  // Cargar valoraciones siempre que cambien idCuidador o idPaseador
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
      } catch (error) {
        console.error("Error cargando valoraciones:", error);
        setLista([]);
      } finally {
        setLoadingValoraciones(false);
      }
    };
    cargarValoraciones();
  }, [idCuidador, idPaseador]);

  const handleEnviar = async () => {
    if (!user || !hasValidUserData()) {
      mostrarAlertaError("No se pudo obtener la información del usuario");
      return;
    }

    // Validar que se hayan completado los campos requeridos
    if (puntaje === 0) {
      mostrarAlertaError("Todos los campos son solicitados");
      return;
    }

    if (!comentario || comentario.trim() === "") {
      mostrarAlertaError("Todos los campos son solicitados");
      return;
    }

    // Obtener el ID del usuario correctamente
    const userId = getUserId();
    if (!userId) {
      mostrarAlertaError("No se pudo obtener el ID del usuario. Por favor, recarga la página e intenta nuevamente.");
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
        setLista((prev) => {
          const filtradoSinEditada = prev.filter(
            (v) => v.id !== valoracionActualizada.id
          );
          return [valoracionActualizada, ...filtradoSinEditada];
        });
        setEditando(false);
        setValoracionEditada(null);
      } else {
        res = await postValoracion(nuevaValoracion);
        setLista((prev) => [
          { ...(res.data || res), nombreUsuario: userData?.nombreCompleto },
          ...prev,
        ]);
      }

      setPuntaje(0);
      setComentario("");
      
      // Mostrar mensaje de éxito
      if (editando) {
        mostrarAlertaExito("Valoración actualizada correctamente");
      } else {
        mostrarAlertaExito("Valoración enviada correctamente");
      }
    } catch (error) {
      console.error("Error detallado:", error);
      console.error("Response data:", error.response?.data);
      
      // Manejar errores específicos del servidor
      let errorMessage = "Error al enviar valoración";
      
      if (error.response?.status === 400) {
        const serverMessage = error.response?.data?.message || error.response?.data;
        
        // Si el error indica campos faltantes, mostrar mensaje genérico
        if (serverMessage && (
          serverMessage.includes("requerida") || 
          serverMessage.includes("requerido") ||
          serverMessage.includes("obligatorio") ||
          serverMessage.includes("necesario")
        )) {
          errorMessage = "Todos los campos son solicitados";
        } else {
          errorMessage = `Error al enviar valoración: ${serverMessage}`;
        }
      } else {
        errorMessage = `Error al enviar valoración: ${error.response?.data?.message || error.message}`;
      }
      
      mostrarAlertaError(errorMessage);
    }
  };

  const handleEliminar = async (valoracionId) => {
    try {
      await deleteValoracion(valoracionId);
      setLista((prev) => prev.filter((v) => v.id !== valoracionId));
      mostrarAlertaExito("Valoración eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar valoración:", error);
      mostrarAlertaError("Error al eliminar la valoración");
    } finally {
      handleCloseMenu();
    }
  };

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

  // Ordenar de más reciente a más antigua y mostrar la valoración del usuario actual al principio
  const listaOrdenada = React.useMemo(() => {
    // No importa si userData es null, solo ordenamos por fecha
    const listaPorFecha = [...lista].sort((a, b) => {
      const fechaA = new Date(a.fechaValoracion || a.fecha || 0);
      const fechaB = new Date(b.fechaValoracion || b.fecha || 0);
      return fechaB - fechaA;
    });

    if (!userData) return listaPorFecha;

    const miVal = listaPorFecha.find((v) => v.idUsuario === userData.id);
    if (!miVal) return listaPorFecha;

    const otros = listaPorFecha.filter((v) => v.id !== miVal.id);
    return [miVal, ...otros];
  }, [lista, userData]);

  // Calcular promedio de valoraciones
  const promedioValoraciones = React.useMemo(() => {
    if (lista.length === 0) return 0;
    const suma = lista.reduce((acc, val) => acc + val.puntaje, 0);
    return suma / lista.length;
  }, [lista]);

  // Verificar si el usuario está intentando calificarse a sí mismo
  const esElMismoUsuario = React.useMemo(() => {
    if (!hasValidUserData() || !idUsuarioPerfil) return false;
    
    const userId = getUserId();
    if (!userId) return false;
    
    // Comparar el ID del usuario logueado con el ID del usuario dueño del perfil
    return userId === idUsuarioPerfil;
  }, [userData, idUsuarioPerfil, hasValidUserData, getUserId]);

  return (
    <Box mt={3}>
      {/* Formulario de calificar y opinar - solo si está logueado y no es el mismo usuario */}
      {userData ? (
        esElMismoUsuario ? (
          <Typography variant="body2" color="text.secondary" mb={2}>
            No puedes calificarte a ti mismo.
          </Typography>
        ) : (
          <>
            <Typography variant="h6" fontWeight={600} mb={2}>
              {editando ? "Editar tu valoración" : "Calificar y opinar"}
            </Typography>
            <Rating
              value={puntaje}
              onChange={(e, newVal) => setPuntaje(newVal)}
              size="large"
            />
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
                disabled={!hasValidUserData() || puntaje === 0 || !comentario || comentario.trim() === ""}
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
        )
      ) : (
        <Typography variant="body2" color="text.secondary" mb={2}>
          Debes iniciar sesión para calificar y opinar.
        </Typography>
      )}

      {/* Resumen de valoraciones */}
      <Box mt={4}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Resumen de valoraciones
        </Typography>

        {lista.length === 0 ? (
          <Typography variant="body2" color="text.secondary" mb={2}>
            Aún no hay valoraciones.
          </Typography>
        ) : (
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Typography variant="h4" color="text.primary" fontWeight="700">
              {promedioValoraciones.toFixed(1)}
            </Typography>
            <PromedioValoracion promedio={promedioValoraciones} size="medium" />
          </Box>
        )}
      </Box>

      {/* Valoraciones de usuarios */}
      <Box mt={2}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Opiniones de usuarios
        </Typography>
        {loadingValoraciones ? (
          <Typography>Cargando...</Typography>
        ) : listaOrdenada.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            Aún no tiene valoraciones.
          </Typography>
        ) : (
          listaOrdenada.map((val) => {
            const esMia = val.idUsuario === userData?.id;

            // Formatear fecha a día/mes/año
            const fechaFormateada = val.fechaValoracion
              ? new Date(val.fechaValoracion).toLocaleDateString("es-AR")
              : "";

            return (
              <Box key={val.id} mb={2}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
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
                        <MenuItem onClick={() => handleEditarClick(val)}>
                          ✏️ Editar
                        </MenuItem>
                        <MenuItem onClick={() => handleEliminar(val.id)}>
                          🗑️ Eliminar
                        </MenuItem>
                      </Menu>
                    </>
                  )}
                </Box>

                {/* Fecha arriba de las estrellas */}
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                  sx={{ mb: 0.5 }}
                >
                  {fechaFormateada && (
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.3 }}>
                      {fechaFormateada}
                    </Typography>
                  )}
                  <Rating value={val.puntaje} readOnly precision={0.5} size="small" />
                </Box>

                <Typography variant="body2">{val.opinion || val.comentario}</Typography>

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
