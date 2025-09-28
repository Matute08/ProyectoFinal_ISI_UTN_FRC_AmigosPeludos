import React, { useState, useEffect } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Typography,
  Tooltip,
  Box,
  Divider,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { getUserMail } from "../api/userApi";
import { postDenuncia, verificarDenuncia } from "../api/denunciasApi";

const motivos = [
  "Estafa, fraude o spam",
  "Información falsa o engañosa",
  "Contenido inapropiado",
  "Perfil falso o usurpación de identidad",
  "Otro motivo",
];

const Denuncias = ({ idEntidad, tipoEntidad }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalYaReportado, setModalYaReportado] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [userData, setUserData] = useState(null);
  const [yaDenuncio, setYaDenuncio] = useState(false);

  useEffect(() => {
    const cargarUsuario = async () => {
      const local = localStorage.getItem("userData");
      if (!local) return;

      const { email } = JSON.parse(local);
      if (!email) return;

      try {
        const res = await getUserMail(email);
        if (res) {
          setUserData(res.data || res);
        }
      } catch (error) {
        console.error("Error cargando usuario backend:", error);
        setUserData(null);
      }
    };

    cargarUsuario();
  }, []);

  useEffect(() => {
    const verificar = async () => {
      if (!userData?.id || !idEntidad) return;

      try {
        const res = await verificarDenuncia(userData.id, idEntidad, tipoEntidad);
        setYaDenuncio(res.data);
      } catch (error) {
        console.error("Error al verificar denuncia:", error);
      }
    };

    verificar();
  }, [userData, idEntidad, tipoEntidad]);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleAbrirModal = () => {
    handleMenuClose();
    if (yaDenuncio) {
      setModalYaReportado(true);
    } else {
      setModalOpen(true);
    }
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setMotivo("");
    setEnviado(false);
  };

  const handleCerrarYaReportado = () => {
    setModalYaReportado(false);
  };

  const handleEnviar = async () => {
    if (!motivo) return;

    if (!userData?.id) {
      alert("Tenés que iniciar sesión para poder denunciar.");
      return;
    }

    const nuevaDenuncia = {
      idUsuario: userData.id,
      motivo,
    };

    if (tipoEntidad === "paseador") {
      nuevaDenuncia.idPaseador = idEntidad;
    } else if (tipoEntidad === "cuidador") {
      nuevaDenuncia.idCuidador = idEntidad;
    } else if (tipoEntidad === "fundacion") {
      nuevaDenuncia.idFundacion = idEntidad;
    } else if (tipoEntidad === "veterinaria") {
      nuevaDenuncia.idVeterinaria = idEntidad;
    } else {
      nuevaDenuncia.idPublicacion = idEntidad;
    }


    try {
      await postDenuncia(nuevaDenuncia, tipoEntidad);
      setEnviado(true);
      setYaDenuncio(true);
    } catch (error) {
      console.error("Error al enviar denuncia:", error);
      alert("Error al enviar denuncia");
    }
  };

  return (
    <>
      <Tooltip title="Opciones">
        <IconButton
          onClick={handleMenuOpen}
          size="small"
          sx={{
            color: "black",
            bgcolor: "transparent",
            "&:hover": {
              color: "#444444",
              boxShadow: "0 0 6px rgba(0,0,0,0.2)",
              bgcolor: "transparent",
            },
            borderRadius: 1,
          }}
          aria-label="opciones"
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "rgba(0,0,0,0.15) 0px 4px 12px",
          },
        }}
      >
        <MenuItem onClick={handleAbrirModal} sx={{ color: "error.main" }}>
          Reportar
        </MenuItem>
      </Menu>

      <Dialog
        open={modalOpen}
        onClose={handleCerrarModal}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 0,
            overflow: "visible",
          },
        }}
      >
        {enviado ? (
          <Box
            sx={{
              position: "relative",
              py: 5,
              px: 3,
              backgroundColor: "#e6f4ea",
              borderRadius: 3,
              boxShadow: 2,
              textAlign: "center",
            }}
          >
            <IconButton
              onClick={handleCerrarModal}
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "success.main",
              }}
              aria-label="cerrar"
            >
              <CloseIcon />
            </IconButton>

            <CheckCircleIcon
              sx={{ fontSize: 64, color: "success.main", mb: 2 }}
            />
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: "success.main", mb: 1 }}
            >
              ¡Gracias por avisarnos!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: 280,
                mx: "auto",
                fontSize: 15,
              }}
            >
              Revisaremos tu reporte lo antes posible. Gracias por ayudarnos a cuidar la comunidad.
            </Typography>
          </Box>
        ) : (
          <>
            <DialogTitle
              sx={{ textAlign: "center", fontWeight: 600, color: "text.primary" }}
            >
              ¿Por qué estás reportando?
            </DialogTitle>
            <Divider sx={{ mb: 2 }} />
            <DialogContent sx={{ px: 2 }}>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                >
                  {motivos.map((m) => (
                    <FormControlLabel
                      key={m}
                      value={m}
                      control={<Radio />}
                      label={m}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between", px: 2 }}>
              <Button onClick={handleCerrarModal}>Cancelar</Button>
              <Button variant="contained" onClick={handleEnviar} disabled={!motivo}>
                Enviar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog open={modalYaReportado} onClose={handleCerrarYaReportado}>
        <DialogTitle sx={{ textAlign: "center" }}>
          Ya reportaste esta publicación
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography variant="body1">
            Gracias por ayudarnos a mantener la comunidad segura.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={handleCerrarYaReportado} autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Denuncias;
