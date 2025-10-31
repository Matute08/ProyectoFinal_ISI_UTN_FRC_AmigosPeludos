import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Collapse,
  IconButton, Tooltip, Typography, Select, MenuItem, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button
} from "@mui/material";
import {
  KeyboardArrowDown, KeyboardArrowUp,
  Visibility as VisibilityIcon, Delete as DeleteIcon,
  DisabledByDefault as MantenerIcon, WarningAmber as WarningIcon
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import {
  cambiarEstado,
  getEstadosDenuncias,
  deshabilitarPublicacion,
  marcarDesestimada,
} from "../../api/denunciasApi";

const VerDenunciasPublicaciones = ({ denuncias }) => {
  const [expanded, setExpanded] = useState(null);
  const [localDenuncias, setLocalDenuncias] = useState(denuncias);
  const [estados, setEstados] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(true);
  const [updating, setUpdating] = useState({});

  // === Eliminar ===
  const [openConfirm, setOpenConfirm] = useState(false);
  const [idPublicacionAEliminar, setIdPublicacionAEliminar] = useState(null);
  const [errorEliminacion, setErrorEliminacion] = useState("");

  // === Mantener ===
  const [openConfirmMantener, setOpenConfirmMantener] = useState(false);
  const [idPublicacionAMantener, setIdPublicacionAMantener] = useState(null);

  useEffect(() => {
    setLocalDenuncias(denuncias);
  }, [denuncias]);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const res = await getEstadosDenuncias();
        setEstados(res.data || []);
      } catch {
        setEstados([
          { id: 1, estado: "Pendiente" },
          { id: 2, estado: "Aceptada" },
          { id: 3, estado: "Rechazada" },
        ]);
      } finally {
        setLoadingEstados(false);
      }
    };
    fetchEstados();
  }, []);

  // ==== Eliminar ====
  const abrirConfirmacion = (idPublicacion) => {
    const denunciasPorPublicacion = localDenuncias.filter(d => d.idPublicacion === idPublicacion);

    const tienePendientes = denunciasPorPublicacion.some(d => d.estadoDenuncia === 1);
    const tieneAceptadas = denunciasPorPublicacion.some(d => d.estadoDenuncia === 2);
    const todasRechazadas = denunciasPorPublicacion.length > 0 && denunciasPorPublicacion.every(d => d.estadoDenuncia === 3);

    if (tienePendientes) {
      setErrorEliminacion("No se puede eliminar la publicación porque tiene denuncias pendientes.");
      setOpenConfirm(true);
      setIdPublicacionAEliminar(null);
    } else if (todasRechazadas || !tieneAceptadas) {
      setErrorEliminacion("No se puede eliminar la publicación porque no hay denuncias aceptadas.");
      setOpenConfirm(true);
      setIdPublicacionAEliminar(null);
    } else {
      setErrorEliminacion("");
      setIdPublicacionAEliminar(idPublicacion);
      setOpenConfirm(true);
    }
  };

  const cerrarConfirmacion = () => {
    setIdPublicacionAEliminar(null);
    setOpenConfirm(false);
    setErrorEliminacion("");
  };

  const confirmarEliminar = async () => {
    if (idPublicacionAEliminar != null) {
      try {
        await deshabilitarPublicacion(idPublicacionAEliminar);
        setLocalDenuncias((prev) =>
          prev.filter((d) => d.idPublicacion !== idPublicacionAEliminar)
        );
        if (expanded === idPublicacionAEliminar) {
          setExpanded(null);
        }
        cerrarConfirmacion();
      } catch (error) {
        if (error.response?.status === 400) {
          setErrorEliminacion(error.response.data);
        } else {
          console.error("Error al eliminar publicación:", error);
          setErrorEliminacion("Ocurrió un error inesperado.");
        }
      }
    }
  };

  // ==== Mantener ====
  const abrirConfirmacionMantener = (idPublicacion) => {
    setIdPublicacionAMantener(idPublicacion);
    setOpenConfirmMantener(true);
  };

  const cerrarConfirmacionMantener = () => {
    setIdPublicacionAMantener(null);
    setOpenConfirmMantener(false);
  };

  const confirmarMantener = async () => {
    if (idPublicacionAMantener != null) {
      try {
        await marcarDesestimada(idPublicacionAMantener);
        setLocalDenuncias((prev) =>
          prev.filter((d) => d.idPublicacion !== parseInt(idPublicacionAMantener))
        );
        if (expanded === idPublicacionAMantener) {
          setExpanded(null);
        }
        cerrarConfirmacionMantener();
      } catch (error) {
        console.error("Error al mantener publicación:", error);
      }
    }
  };

  // ==== Cambio individual ====
  const handleCambioEstado = async (idDenuncia, nuevoEstado) => {
    setUpdating((u) => ({ ...u, [idDenuncia]: true }));
    try {
      await cambiarEstado(idDenuncia, nuevoEstado);
      setLocalDenuncias((prev) =>
        prev.map((d) =>
          d.id === idDenuncia ? { ...d, estadoDenuncia: nuevoEstado } : d
        )
      );
    } catch (error) {
      console.error("Error al cambiar estado de denuncia", error);
    } finally {
      setUpdating((u) => ({ ...u, [idDenuncia]: false }));
    }
  };

  // ==== NUEVO ====
  const handleMarcarTodas = async (idPublicacion, nuevoEstado) => {
    const denunciasPorPublicacion = localDenuncias.filter(d => d.idPublicacion === parseInt(idPublicacion));
    setUpdating(prev => {
      const actualizaciones = {};
      denunciasPorPublicacion.forEach(d => { actualizaciones[d.id] = true; });
      return { ...prev, ...actualizaciones };
    });

    try {
      await Promise.all(
        denunciasPorPublicacion.map(d => cambiarEstado(d.id, nuevoEstado))
      );

      setLocalDenuncias(prev =>
        prev.map(d =>
          d.idPublicacion === parseInt(idPublicacion)
            ? { ...d, estadoDenuncia: nuevoEstado }
            : d
        )
      );
    } catch (error) {
      console.error("Error al cambiar todas las denuncias:", error);
    } finally {
      setUpdating(prev => {
        const actualizaciones = {};
        denunciasPorPublicacion.forEach(d => { actualizaciones[d.id] = false; });
        return { ...prev, ...actualizaciones };
      });
    }
  };

  // ==== Agrupación ====
  const agrupadas = localDenuncias.reduce((acc, d) => {
    if (!acc[d.idPublicacion]) acc[d.idPublicacion] = [];
    acc[d.idPublicacion].push(d);
    return acc;
  }, {});

  const ids = Object.keys(agrupadas);

  if (ids.length === 0) {
    return <Typography align="center" mt={3}>No hay denuncias.</Typography>;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID Publicación</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tipo de Publicación</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Cantidad de Denuncias</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {ids.map((id) => {
              const denunciasPorId = agrupadas[id].slice().sort((a, b) =>
                a.estadoDenuncia !== b.estadoDenuncia
                  ? a.estadoDenuncia - b.estadoDenuncia
                  : new Date(a.fechaDenuncia) - new Date(b.fechaDenuncia)
              );

              const d = denunciasPorId[0];
              const isOpen = expanded === id;

              // === Reglas híbridas ===
              const tienePendientes = denunciasPorId.some(x => x.estadoDenuncia === 1);
              const tieneAceptadas = denunciasPorId.some(x => x.estadoDenuncia === 2);
              const todasRechazadas = denunciasPorId.length > 0 && denunciasPorId.every(x => x.estadoDenuncia === 3);

              const canEliminar = !tienePendientes && tieneAceptadas;
              const canMantener = todasRechazadas && !tienePendientes && !tieneAceptadas;

              const tooltipEliminar = canEliminar
                ? "Eliminar publicación"
                : tienePendientes
                  ? "No se puede eliminar: hay denuncias pendientes."
                  : "No se puede eliminar: no hay denuncias aceptadas.";

              const tooltipMantener = canMantener
                ? "Mantener publicación"
                : tienePendientes
                  ? "No se puede mantener: hay denuncias pendientes."
                  : tieneAceptadas
                    ? "No se puede mantener: hay denuncias aceptadas."
                    : "No se puede mantener: deben estar todas rechazadas.";

              return (
                <React.Fragment key={id}>
                  <TableRow hover sx={{ backgroundColor: isOpen ? "#f0f0f0" : "inherit" }}>
                    <TableCell>{id}</TableCell>
                    <TableCell>{d.tipoPublicacion}</TableCell>
                    <TableCell>{denunciasPorId.length}</TableCell>
                    <TableCell>
                      <Tooltip title="Ver publicación">
                        <IconButton
                          component={RouterLink}
                          to={
                            d.tipoPublicacion === "Encontrada"
                              ? `/consultar-posteo-encontrada/${id}`
                              : d.tipoPublicacion === "Perdida"
                                ? `/consultar-posteo-perdida/${id}`
                                : `/consultar-posteo-adopcion/${id}`
                          }
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={tooltipEliminar}>
                        <span>
                          <IconButton
                            onClick={() => abrirConfirmacion(parseInt(id))}
                            color="error"
                            disabled={!canEliminar}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title={tooltipMantener}>
                        <span>
                          <IconButton
                            onClick={() => abrirConfirmacionMantener(parseInt(id))}
                            color="success"
                            disabled={!canMantener}
                          >
                            <MantenerIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="Ver denuncias">
                        <IconButton onClick={() => setExpanded(isOpen ? null : id)}>
                          {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={5} sx={{ py: 0 }}>
                      <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2, pl: 6 }}>
                          
                          {/* === NUEVOS BOTONES === */}
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              mb: 2,
                              justifyContent: "flex-end",
                              flexWrap: "wrap",
                            }}
                          >
                            <Button
                              variant="outlined"
                              color="success"
                              size="small"
                              onClick={() => handleMarcarTodas(id, 2)} // 2 = Aceptada
                              sx={{
                                borderRadius: 4,
                                textTransform: "none",
                                fontWeight: 500,
                                px: 2,
                              }}
                            >
                              ✅ Marcar todas como aceptadas
                            </Button>

                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleMarcarTodas(id, 3)} // 3 = Rechazada
                              sx={{
                                borderRadius: 4,
                                textTransform: "none",
                                fontWeight: 500,
                                px: 2,
                              }}
                            >
                              ❌ Marcar todas como rechazadas
                            </Button>
                          </Box>
                          {/* === FIN NUEVOS BOTONES === */}

                          {denunciasPorId.map((denuncia) => {
                            const estadoActual = estados.find(e => e.id === denuncia.estadoDenuncia);
                            const estadoTexto = estadoActual?.estado || "Desconocido";

                            let backgroundColor = "#f5faff";
                            let fontWeight = "normal";
                            if (estadoTexto === "Aceptada") backgroundColor = "#e6f4ea";
                            if (estadoTexto === "Rechazada") backgroundColor = "#fbeaea";
                            if (estadoTexto === "Pendiente") fontWeight = "bold";

                            return (
                              <Paper
                                key={denuncia.id}
                                elevation={1}
                                sx={{
                                  p: 2, mb: 1, ml: 2,
                                  borderLeft: "3px solid #90caf9",
                                  backgroundColor,
                                }}
                              >
                                <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" color="textSecondary">Fecha</Typography>
                                    <Typography variant="body2">
                                      {new Date(denuncia.fechaDenuncia).toLocaleString()}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" color="textSecondary">Usuario denunciante</Typography>
                                    <Typography variant="body2">{denuncia.usuarioDenunciante}</Typography>
                                  </Box>
                                  <Box sx={{ flex: 2 }}>
                                    <Typography variant="subtitle2" color="textSecondary">Motivo</Typography>
                                    <Typography variant="body2">{denuncia.motivo}</Typography>
                                  </Box>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" color="textSecondary">Estado</Typography>
                                    {loadingEstados ? (
                                      <CircularProgress size={16} />
                                    ) : (
                                      <Select
                                        size="small"
                                        variant="standard"
                                        value={denuncia.estadoDenuncia}
                                        onChange={(e) => handleCambioEstado(denuncia.id, e.target.value)}
                                        disabled={updating[denuncia.id]}
                                        sx={{ fontSize: '0.875rem', fontWeight }}
                                      >
                                        {estados.map((e) => (
                                          <MenuItem key={e.id} value={e.id}>{e.estado}</MenuItem>
                                        ))}
                                      </Select>
                                    )}
                                  </Box>
                                </Box>
                              </Paper>
                            );
                          })}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* === Diálogo Confirmación / Error Eliminar === */}
      <Dialog
        open={openConfirm}
        onClose={cerrarConfirmacion}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: errorEliminacion ? '#d32f2f' : '#1976d2' }}>
          <WarningIcon fontSize="large" />
          {errorEliminacion ? "No se puede eliminar" : "Confirmar eliminación"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ fontSize: '1.05rem', mt: 1 }}>
            {errorEliminacion
              ? errorEliminacion
              : "¿Estás seguro que deseas eliminar esta publicación? Esta acción es irreversible."}
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={cerrarConfirmacion} variant="outlined" color="primary">
            {errorEliminacion ? "Cerrar" : "No, cancelar"}
          </Button>
          {!errorEliminacion && (
            <Button onClick={confirmarEliminar} variant="contained" color="error" autoFocus>
              Sí, eliminar
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* === Diálogo Confirmación Mantener === */}
      <Dialog
        open={openConfirmMantener}
        onClose={cerrarConfirmacionMantener}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#2e7d32' }}>
          <WarningIcon fontSize="large" />
          Confirmar mantenimiento
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ fontSize: '1.05rem', mt: 1 }}>
            ¿Estás seguro que deseas mantener esta publicación?
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={cerrarConfirmacionMantener} variant="outlined" color="primary">
            No, cancelar
          </Button>
          <Button onClick={confirmarMantener} variant="contained" color="success" autoFocus>
            Sí, mantener
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VerDenunciasPublicaciones;
