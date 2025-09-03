import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Tooltip, IconButton, Collapse, Box, Typography,
  Select, MenuItem, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

import {
  getEstadosDenuncias,
  cambiarEstadoDenunciaPaseador,
  deshabilitarPaseador,
  marcarDesestimadaPaseador,
} from "../../api/denunciasApi";

const VerDenunciasPaseadores = ({ denuncias }) => {
  const [expanded, setExpanded] = useState(null);
  const [estados, setEstados] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(true);
  const [updating, setUpdating] = useState({});
  const [denunciasData, setDenunciasData] = useState(denuncias);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [tipoConfirm, setTipoConfirm] = useState(""); // "deshabilitar" o "mantener"
  const [idPaseadorTarget, setIdPaseadorTarget] = useState(null);
  const [errorConfirm, setErrorConfirm] = useState("");

  useEffect(() => {
    setDenunciasData(denuncias);
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

  const toggleExpand = (idPaseador) => {
    setExpanded((prev) => (prev === idPaseador ? null : idPaseador));
  };

  const handleCambioEstado = async (idDenuncia, nuevoEstado) => {
    setUpdating((u) => ({ ...u, [idDenuncia]: true }));
    try {
      await cambiarEstadoDenunciaPaseador(idDenuncia, nuevoEstado);
      setDenunciasData((prev) =>
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

  // Abrir confirmación dinámica (deshabilitar o mantener)
  const abrirConfirmacion = (idPaseador, tipo) => {
    const denunciasDelPaseador = denunciasData.filter(d => d.idPaseador === idPaseador);
    const tienePendientes = denunciasDelPaseador.some(d => d.estadoDenuncia === 1);
    const tieneAceptadas = denunciasDelPaseador.some(d => d.estadoDenuncia === 2);
    const todasRechazadas = denunciasDelPaseador.length > 0 && denunciasDelPaseador.every(d => d.estadoDenuncia === 3);

    if (tipo === "deshabilitar") {
      if (tienePendientes) {
        setErrorConfirm("No se puede deshabilitar el paseador porque tiene denuncias pendientes.");
        setIdPaseadorTarget(null);
      } else if (todasRechazadas || !tieneAceptadas) {
        setErrorConfirm("No se puede deshabilitar el paseador porque no hay denuncias aceptadas.");
        setIdPaseadorTarget(null);
      } else {
        setErrorConfirm("");
        setIdPaseadorTarget(idPaseador);
      }
    } else if (tipo === "mantener") {
      if (!todasRechazadas) {
        setErrorConfirm("Solo se puede mantener un paseador si todas sus denuncias están rechazadas.");
        setIdPaseadorTarget(null);
      } else {
        setErrorConfirm("");
        setIdPaseadorTarget(idPaseador);
      }
    }

    setTipoConfirm(tipo);
    setOpenConfirm(true);
  };

  const cerrarConfirmacion = () => {
    setOpenConfirm(false);
    setIdPaseadorTarget(null);
    setErrorConfirm("");
    setTipoConfirm("");
  };

  const confirmarAccion = async () => {
    if (idPaseadorTarget == null) return;

    if (tipoConfirm === "deshabilitar") {
      try {
        await deshabilitarPaseador(idPaseadorTarget);
        setDenunciasData(prev => prev.filter(d => d.idPaseador !== idPaseadorTarget));
        if (expanded === idPaseadorTarget) setExpanded(null);
        cerrarConfirmacion();
      } catch (error) {
        setErrorConfirm(error.response?.data || "Ocurrió un error inesperado.");
      }
    } else if (tipoConfirm === "mantener") {
      try {
        await marcarDesestimadaPaseador(idPaseadorTarget);  // 👈 llamada al backend
        setDenunciasData(prev =>
          prev.filter(d => d.idPaseador !== idPaseadorTarget)
        );
        if (expanded === idPaseadorTarget) setExpanded(null);
        cerrarConfirmacion();
      } catch (error) {
        console.error("Error al mantener paseador:", error);
        setErrorConfirm(error.response?.data || "Ocurrió un error inesperado.");
      }
    }

  };

  const denunciasAgrupadas = denunciasData.reduce((acc, denuncia) => {
    if (!acc[denuncia.idPaseador]) {
      acc[denuncia.idPaseador] = {
        paseador: { id: denuncia.idPaseador, nombre: denuncia.nombrePaseador },
        denuncias: [],
      };
    }
    acc[denuncia.idPaseador].denuncias.push(denuncia);
    return acc;
  }, {});

  const ids = Object.keys(denunciasAgrupadas);

  if (ids.length === 0) return <Typography align="center" mt={3}>No hay denuncias.</Typography>;

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Paseador denunciado</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Cantidad de denuncias</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {ids.map((id) => {
              const { paseador, denuncias } = denunciasAgrupadas[id];
              const isOpen = expanded === id;

              const tienePendientes = denuncias.some(d => d.estadoDenuncia === 1);
              const tieneAceptadas = denuncias.some(d => d.estadoDenuncia === 2);
              const todasRechazadas = denuncias.length > 0 && denuncias.every(d => d.estadoDenuncia === 3);

              const canDeshabilitar = !tienePendientes && tieneAceptadas;
              const canMantener = todasRechazadas;

              return (
                <React.Fragment key={id}>
                  <TableRow hover sx={{ backgroundColor: isOpen ? "#f0f0f0" : "inherit" }}>
                    <TableCell>{paseador.nombre}</TableCell>
                    <TableCell>{denuncias.length}</TableCell>
                    <TableCell>
                      <Tooltip title="Ver perfil">
                        <IconButton component={RouterLink} to={`/perfil-paseador/${paseador.id}`} color="primary">
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={canDeshabilitar ? "Deshabilitar paseador" : "No se puede deshabilitar"}>
                        <span>
                          <IconButton onClick={() => abrirConfirmacion(paseador.id, "deshabilitar")} color="error" disabled={!canDeshabilitar}>
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title={canMantener ? "Mantener paseador" : "No se puede mantener"}>
                        <span>
                          <IconButton onClick={() => abrirConfirmacion(paseador.id, "mantener")} sx={{ color: "green" }} disabled={!canMantener}>
                            <DisabledByDefaultIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Ver denuncias">
                        <IconButton onClick={() => toggleExpand(id)}>
                          {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={4} sx={{ py: 0 }}>
                      <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2, pl: 6 }}>
                          {denuncias.map((denuncia) => {
                            const estadoActual = estados.find(e => e.id === denuncia.estadoDenuncia);
                            const estadoTexto = estadoActual?.estado || "Desconocido";
                            let backgroundColor = "#f5faff";
                            let fontWeight = "normal";
                            if (estadoTexto === "Aceptada") backgroundColor = "#e6f4ea";
                            if (estadoTexto === "Rechazada") backgroundColor = "#fbeaea";
                            if (estadoTexto === "Pendiente") fontWeight = "bold";

                            return (
                              <Paper key={denuncia.id} elevation={1} sx={{ p: 2, mb: 1, ml: 2, borderLeft: "3px solid #90caf9", backgroundColor }}>
                                <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "center" }}>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" color="textSecondary">Fecha</Typography>
                                    <Typography variant="body2">{new Date(denuncia.fechaDenuncia).toLocaleString()}</Typography>
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
                                        onChange={(e) => handleCambioEstado(denuncia.id, parseInt(e.target.value))}
                                        disabled={updating[denuncia.id]}
                                        sx={{ fontSize: "0.875rem", fontWeight }}
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

      <Dialog open={openConfirm} onClose={cerrarConfirmacion} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: errorConfirm ? "#d32f2f" : "#1976d2" }}>
          {errorConfirm ? <CancelIcon fontSize="large" sx={{ mr: 1 }} /> : tipoConfirm === "deshabilitar" ? <DeleteIcon fontSize="large" sx={{ mr: 1 }} /> : <DisabledByDefaultIcon fontSize="large" sx={{ mr: 1 }} />}
          {errorConfirm ? "Acción no permitida" : tipoConfirm === "deshabilitar" ? "Confirmar deshabilitación" : "Confirmar mantenimiento"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ fontSize: "1.05rem", mt: 1 }}>
            {errorConfirm
              ? errorConfirm
              : tipoConfirm === "deshabilitar"
              ? "¿Estás seguro que deseas deshabilitar este paseador? Esta acción es irreversible."
              : "¿Estás seguro que deseas mantener este paseador?"}
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={cerrarConfirmacion} variant="outlined" color="primary">
            {errorConfirm ? "Cerrar" : "No, cancelar"}
          </Button>
          {!errorConfirm && (
            <Button onClick={confirmarAccion} variant="contained" color={tipoConfirm === "deshabilitar" ? "error" : "success"} autoFocus>
              Sí, {tipoConfirm === "deshabilitar" ? "deshabilitar" : "mantener"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VerDenunciasPaseadores;
