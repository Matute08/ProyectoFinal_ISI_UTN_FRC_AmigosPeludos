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
  cambiarEstadoDenunciaVeterinaria,
  deshabilitarVeterinaria,
  marcarDesestimadaVeterinaria,
} from "../../api/denunciasApi";
import { mostrarAlertaExito, mostrarAlertaError } from "../../utils/showAlert";

const VerDenunciasVeterinarias = ({ denuncias, onActualizarDenuncias }) => {
  const [expanded, setExpanded] = useState(null);
  const [estados, setEstados] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(true);
  const [updating, setUpdating] = useState({});
  const [denunciasData, setDenunciasData] = useState(denuncias);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [idVeterinariaTarget, setIdVeterinariaTarget] = useState(null);
  const [tipoConfirm, setTipoConfirm] = useState(""); // "deshabilitar" | "mantener"
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

  const toggleExpand = (idVeterinaria) => {
    setExpanded((prev) => (prev === idVeterinaria ? null : idVeterinaria));
  };

  const handleCambioEstado = async (idDenuncia, nuevoEstado) => {
    setUpdating((u) => ({ ...u, [idDenuncia]: true }));
    try {
      await cambiarEstadoDenunciaVeterinaria(idDenuncia, nuevoEstado);
      const nuevaLista = denunciasData.map((d) =>
        d.id === idDenuncia ? { ...d, estadoDenuncia: nuevoEstado } : d
      );
      setDenunciasData(nuevaLista);
      // Actualización optimista en el componente padre
      if (onActualizarDenuncias) {
        onActualizarDenuncias(nuevaLista);
      }
      
      // Obtener el nombre del estado para el mensaje
      const estadoNombre = estados.find(e => e.id === nuevoEstado)?.estado || `Estado ${nuevoEstado}`;
      mostrarAlertaExito(`Estado de denuncia actualizado a: ${estadoNombre}`);
    } catch (error) {
      console.error("Error al cambiar estado de denuncia", error);
      const errorMessage = error.response?.data?.message || error.message || "Error al actualizar el estado de la denuncia";
      mostrarAlertaError(errorMessage);
    } finally {
      setUpdating((u) => ({ ...u, [idDenuncia]: false }));
    }
  };
  // ==== NUEVO ====
  // Cambiar todas las denuncias de una veterinaria a un estado
  const handleMarcarTodas = async (idVeterinaria, nuevoEstado) => {
    const denunciasDeVeterinaria = denunciasData.filter(
      d => d.idVeterinaria === parseInt(idVeterinaria)
    );

    setUpdating(prev => {
      const actualizaciones = {};
      denunciasDeVeterinaria.forEach(d => { actualizaciones[d.id] = true; });
      return { ...prev, ...actualizaciones };
    });

    try {
      await Promise.all(
        denunciasDeVeterinaria.map(d => cambiarEstadoDenunciaVeterinaria(d.id, nuevoEstado))
      );

      setDenunciasData(prev =>
        prev.map(d =>
          d.idVeterinaria === parseInt(idVeterinaria)
            ? { ...d, estadoDenuncia: nuevoEstado }
            : d
        )
      );
    } catch (error) {
      console.error("Error al cambiar todas las denuncias:", error);
    } finally {
      setUpdating(prev => {
        const actualizaciones = {};
        denunciasDeVeterinaria.forEach(d => { actualizaciones[d.id] = false; });
        return { ...prev, ...actualizaciones };
      });
    }
  };

  const abrirConfirmacion = (idVeterinaria, tipo) => {
    const denunciasDeVeterinaria = denunciasData.filter(d => d.idVeterinaria === idVeterinaria);

    const tienePendientes = denunciasDeVeterinaria.some(d => d.estadoDenuncia === 1);
    const tieneAceptadas = denunciasDeVeterinaria.some(d => d.estadoDenuncia === 2);
    const todasRechazadas = denunciasDeVeterinaria.length > 0 && denunciasDeVeterinaria.every(d => d.estadoDenuncia === 3);

    if (tipo === "deshabilitar") {
      if (tienePendientes || !tieneAceptadas) {
        setErrorConfirm("No se puede deshabilitar la veterinaria. Verifique el estado de las denuncias.");
        setOpenConfirm(true);
        return;
      }
    }

    if (tipo === "mantener") {
      if (!todasRechazadas) {
        setErrorConfirm("Solo se puede mantener la veterinaria si todas las denuncias fueron rechazadas.");
        setOpenConfirm(true);
        return;
      }
    }

    setErrorConfirm("");
    setIdVeterinariaTarget(idVeterinaria);
    setTipoConfirm(tipo);
    setOpenConfirm(true);
  };

  const cerrarConfirmacion = () => {
    setOpenConfirm(false);
    setIdVeterinariaTarget(null);
    setTipoConfirm("");
    setErrorConfirm("");
  };

  const confirmarAccion = async () => {
    if (!idVeterinariaTarget) return;

    try {
      if (tipoConfirm === "deshabilitar") {
        await deshabilitarVeterinaria(idVeterinariaTarget);
        mostrarAlertaExito("Veterinaria deshabilitada correctamente");
      } else if (tipoConfirm === "mantener") {
        await marcarDesestimadaVeterinaria(idVeterinariaTarget);
        mostrarAlertaExito("Veterinaria mantenida - denuncias desestimadas");
      }

      const nuevaLista = denunciasData.filter((d) => d.idVeterinaria !== parseInt(idVeterinariaTarget));
      setDenunciasData(nuevaLista);
      // Actualización optimista en el componente padre
      if (onActualizarDenuncias) {
        onActualizarDenuncias(nuevaLista);
      }
      if (expanded === idVeterinariaTarget) setExpanded(null);
      cerrarConfirmacion();
    } catch (error) {
      console.error("Error al realizar acción:", error);
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || "Ocurrió un error inesperado";
      mostrarAlertaError(errorMessage);
      setErrorConfirm(errorMessage);
    }
  };

  const denunciasAgrupadas = denunciasData.reduce((acc, denuncia) => {
    if (!acc[denuncia.idVeterinaria]) {
      acc[denuncia.idVeterinaria] = {
        veterinaria: {
          id: denuncia.idVeterinaria,
          nombre: denuncia.nombreVeterinaria,
        },
        denuncias: [],
      };
    }
    acc[denuncia.idVeterinaria].denuncias.push(denuncia);
    return acc;
  }, {});

  const ids = Object.keys(denunciasAgrupadas);

  if (ids.length === 0) {
    return (
      <Typography align="center" mt={3}>
        No hay denuncias.
      </Typography>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Veterinaria denunciada</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Cantidad de denuncias</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {ids.map((id) => {
              const { veterinaria, denuncias } = denunciasAgrupadas[id];
              const isOpen = expanded === id;

              const tienePendientes = denuncias.some(d => d.estadoDenuncia === 1);
              const tieneAceptadas = denuncias.some(d => d.estadoDenuncia === 2);
              const todasRechazadas = denuncias.length > 0 && denuncias.every(d => d.estadoDenuncia === 3);

              const canDeshabilitar = !tienePendientes && tieneAceptadas;
              const canMantener = todasRechazadas;

              return (
                <React.Fragment key={id}>
                  <TableRow hover sx={{ backgroundColor: isOpen ? "#f0f0f0" : "inherit" }}>
                    <TableCell>{veterinaria.nombre}</TableCell>
                    <TableCell>{denuncias.length}</TableCell>
                    <TableCell>
                      <Tooltip title="Ver veterinaria">
                        <IconButton
                          component={RouterLink}
                          to={`/veterinarias`}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={canDeshabilitar ? "Deshabilitar veterinaria" : "No se puede deshabilitar"}>
                        <span>
                          <IconButton
                            onClick={() => abrirConfirmacion(veterinaria.id, "deshabilitar")}
                            color="error"
                            disabled={!canDeshabilitar}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title={canMantener ? "Mantener veterinaria" : "No se puede mantener"}>
                        <span>
                          <IconButton
                            onClick={() => abrirConfirmacion(veterinaria.id, "mantener")}
                            sx={{ color: "green" }}
                            disabled={!canMantener}
                          >
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
                                sx={{ borderRadius: 4, textTransform: "none", fontWeight: 500, px: 2 }}
                              >
                                ✅ Marcar todas como aceptadas
                              </Button>

                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleMarcarTodas(id, 3)} // 3 = Rechazada
                                sx={{ borderRadius: 4, textTransform: "none", fontWeight: 500, px: 2 }}
                              >
                                ❌ Marcar todas como rechazadas
                              </Button>
                            </Box>
                            {/* === FIN NUEVOS BOTONES === */}

                          {denuncias.map((denuncia) => {
                            const estadoActual = estados.find(
                              (e) => e.id === denuncia.estadoDenuncia
                            );
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
                                  p: 2,
                                  mb: 1,
                                  ml: 2,
                                  borderLeft: "3px solid #90caf9",
                                  backgroundColor,
                                }}
                              >
                                <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "center" }}>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                      Fecha
                                    </Typography>
                                    <Typography variant="body2">
                                      {new Date(denuncia.fechaDenuncia).toLocaleString()}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                      Usuario denunciante
                                    </Typography>
                                    <Typography variant="body2">
                                      {denuncia.usuarioDenunciante}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ flex: 2 }}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                      Motivo
                                    </Typography>
                                    <Typography variant="body2">{denuncia.motivo}</Typography>
                                  </Box>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                      Estado
                                    </Typography>
                                    {loadingEstados ? (
                                      <CircularProgress size={16} />
                                    ) : (
                                      <Select
                                        size="small"
                                        variant="standard"
                                        value={denuncia.estadoDenuncia}
                                        onChange={(e) =>
                                          handleCambioEstado(denuncia.id, parseInt(e.target.value))
                                        }
                                        disabled={updating[denuncia.id]}
                                        sx={{ fontSize: "0.875rem", fontWeight }}
                                      >
                                        {estados.map((e) => (
                                          <MenuItem key={e.id} value={e.id}>
                                            {e.estado}
                                          </MenuItem>
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
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: errorConfirm ? "#d32f2f" : "#1976d2",
          }}
        >
          {errorConfirm ? (
            <CancelIcon fontSize="large" sx={{ mr: 1 }} />
          ) : tipoConfirm === "deshabilitar" ? (
            <DeleteIcon fontSize="large" sx={{ mr: 1 }} />
          ) : (
            <DisabledByDefaultIcon fontSize="large" sx={{ mr: 1 }} />
          )}
          {errorConfirm
            ? "Acción no permitida"
            : tipoConfirm === "deshabilitar"
            ? "Confirmar deshabilitación"
            : "Confirmar mantenimiento"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ fontSize: "1.05rem", mt: 1 }}>
            {errorConfirm
              ? errorConfirm
              : tipoConfirm === "deshabilitar"
              ? "¿Estás seguro que deseas deshabilitar esta veterinaria? Esta acción es irreversible."
              : "¿Estás seguro que deseas mantener esta veterinaria activa y desestimar las denuncias?"}
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={cerrarConfirmacion} variant="outlined" color="primary">
            {errorConfirm ? "Cerrar" : "No, cancelar"}
          </Button>
          {!errorConfirm && (
            <Button
              onClick={confirmarAccion}
              variant="contained"
              color={tipoConfirm === "deshabilitar" ? "error" : "success"}
              autoFocus
            >
              {tipoConfirm === "deshabilitar" ? "Sí, deshabilitar" : "Sí, mantener"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VerDenunciasVeterinarias;
