import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
  Tabs,
  Tab,
  Slide,
  Avatar,
  useMediaQuery
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PetsIcon from "@mui/icons-material/Pets";
import ShareIcon from "@mui/icons-material/Share";

import Denuncias from "../../components/Denuncias";

const DIAS = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
const DIAS_LABEL = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const NOMBRES_SERVICIOS = {
  castraciones: "Castraciones",
  ecografias: "Ecografías",
  emergencias: "Emergencias",
  equipoLaboratorio: "Laboratorio",
  guardia24hs: "Guardia 24hs",
  internaciones: "Internaciones",
  observaciones: "Observaciones",
  radiografias: "Radiografías",
  vacunaciones: "Vacunaciones",
};

const PanelDetalleVeterinaria = ({ veterinaria, onClose, open, containerRef }) => {
  const [tab, setTab] = useState(0);
  const hoy = new Date().getDay();
  const isMobile = useMediaQuery('(max-width:900px)');

  if (!open || !veterinaria) return null;

  // Overlay para cerrar al hacer click fuera
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // --- TABS ---
  const TABS = [
    { label: "Horarios", icon: <AccessTimeIcon /> },
    { label: "Servicios", icon: <PetsIcon /> },
    { label: "Donar", icon: <MonetizationOnIcon /> },
    { label: "Redes", icon: <ShareIcon /> },
  ];

  // --- HORARIOS ---
  const renderHorarios = () => (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} mb={2} sx={{ color: "primary.main" }}>
        Horarios de atención:
      </Typography>
      <Box sx={{ pl: 1 }}>
        {DIAS.map((dia, i) => (
          <Box key={dia} display="flex" alignItems="center" mb={0.5}>
            <Typography
              variant="body2"
              fontWeight={i === hoy ? 600 : 400}
              color={i === hoy ? "success.main" : "text.secondary"}
              minWidth={80}
              mr={1}
            >
              {DIAS_LABEL[i]}{i === hoy && " (Hoy)"}:
            </Typography>
            <Typography
              variant="body2"
              fontWeight={i === hoy ? 600 : 400}
              color={i === hoy ? "success.main" : "text.secondary"}
            >
              {veterinaria.horarios?.[dia]
                ? veterinaria.horarios[dia]
                : "No disponible"}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );

  // --- SERVICIOS ---
  const renderServicios = () => {
    const servicios = veterinaria.servicios || {};
    const serviciosArray = Object.entries(servicios)
      .filter(([k, v]) => NOMBRES_SERVICIOS[k] && v)
      .map(([k]) => NOMBRES_SERVICIOS[k]);
    return (
      <Box>
        <Typography variant="subtitle1" fontWeight={600} mb={2} sx={{ color: "primary.main" }}>
          Servicios que ofrece:
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {serviciosArray.map(servicio => (
            <Chip key={servicio} label={servicio} color="success" variant="outlined" />
          ))}
          {servicios.otros && typeof servicios.otros === "string" && servicios.otros.trim() !== "" && (
            <Chip label={servicios.otros} color="info" variant="filled" />
          )}
        </Box>
      </Box>
    );
  };

  // --- DONAR ---
  const renderDonacion = () => (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} mb={2} sx={{ color: "primary.main" }}>
        Donar directo a la veterinaria:
      </Typography>
      <Typography variant="body2" mb={1}>
        <strong>Alias:</strong> {veterinaria.aliasCBU || "-"}
      </Typography>
      <Typography variant="body2" mb={1}>
        <strong>CBU:</strong> {veterinaria.cbu || "-"}
      </Typography>
      <Typography variant="body2">
        <strong>Descripción:</strong> {veterinaria.descripcion || "-"}
      </Typography>
    </Box>
  );

  const renderRedes = () => (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} mb={2} sx={{ color: "primary.main" }}>
        Redes sociales:
      </Typography>
      <Typography variant="body2" mb={1}>
        <strong>Página Web:</strong>{" "}
        {veterinaria.paginaWeb ? (
          <a href={veterinaria.paginaWeb} target="_blank" rel="noopener noreferrer">
            {veterinaria.paginaWeb}
          </a>
        ) : (
          "-"
        )}
      </Typography>
      <Typography variant="body2" mb={1}>
        <strong>Facebook:</strong>{" "}
        {veterinaria.facebookUrl ? (
          <a href={veterinaria.facebookUrl} target="_blank" rel="noopener noreferrer">
            {veterinaria.facebookUrl}
          </a>
        ) : (
          "-"
        )}
      </Typography>
      <Typography variant="body2">
        <strong>Instagram:</strong>{" "}
        {veterinaria.instagramUrl ? (
          <a href={veterinaria.instagramUrl} target="_blank" rel="noopener noreferrer">
            {veterinaria.instagramUrl}
          </a>
        ) : (
          "-"
        )}
      </Typography>
    </Box>
  );

  // Panel flotante dentro del contenedor del mapa
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 20,
        pointerEvents: open ? 'auto' : 'none',
      }}
      ref={containerRef}
    >
      {/* Overlay */}
      <Box
        onClick={handleOverlayClick}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: open ? 'rgba(0,0,0,0.25)' : 'transparent',
          zIndex: 21,
          transition: 'background 0.3s',
        }}
      >
        <Slide
          direction={isMobile ? 'up' : 'left'}
          in={open}
          mountOnEnter
          unmountOnExit
        >
          <Box
            sx={{
              position: 'absolute',
              right: isMobile ? 'auto' : 0,
              left: isMobile ? 0 : 'auto',
              bottom: isMobile ? 0 : 'auto',
              width: { xs: '100%', md: 410 },
              maxWidth: { xs: '100%', md: 410 },
              height: isMobile ? '70%' : '100%',
              maxHeight: isMobile ? '80%' : '100%',
              bgcolor: '#fff',
              boxShadow: 7,
              borderRadius: isMobile ? '24px 24px 0 0' : '24px 0 0 24px',
              p: { xs: 2, md: 3 },
              zIndex: 22,
              overflowY: 'auto',
              transition: 'border-radius 0.3s',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* --- CONTENIDO DEL PANEL --- */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h5" fontWeight={700} color="primary" sx={{ letterSpacing: 0.5 }}>
                {veterinaria.nombre}
              </Typography>
              <Avatar
                src={veterinaria.fotoUrl || "/images/veterinaria-placeholder.png"}
                alt={veterinaria.nombre}
                sx={{ width: 64, height: 64 }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Denuncias idEntidad={veterinaria.id} tipoEntidad="veterinaria" />
                <IconButton size="small" onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
            {/* Datos principales */}
            <Box mb={2}>
              <Typography variant="body1" display="flex" alignItems="center" gap={1}>
                <PlaceIcon fontSize="small" /> {veterinaria.direccion} {veterinaria.numeroCalle}
              </Typography>
              <Typography variant="body1" display="flex" alignItems="center" gap={1}>
                <LocalPhoneIcon fontSize="small" /> {veterinaria.numeroTelefono}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {/* TABS */}
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="Tabs veterinaria"
              sx={{
                mb: 2,
                borderBottom: 1,
                borderColor: "divider",
                '.Mui-selected': { color: "primary.main" }
              }}
            >
              {TABS.map((t, idx) => (
                <Tab key={t.label} icon={t.icon} iconPosition="start" label={t.label} value={idx} />
              ))}
            </Tabs>
            {/* PANEL SEGÚN TAB */}
            <Box>
              {tab === 0 && renderHorarios()}
              {tab === 1 && renderServicios()}
              {tab === 2 && renderDonacion()}
              {tab === 3 && renderRedes()}
            </Box>
          </Box>
        </Slide>
      </Box>
    </Box>
  );
};

export default PanelDetalleVeterinaria;
