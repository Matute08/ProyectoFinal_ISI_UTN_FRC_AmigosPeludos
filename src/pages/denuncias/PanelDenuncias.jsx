import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Tabs, Tab } from "@mui/material";
import {
  getDenuncias,
  getDenunciasPaseadores,
  getDenunciasCuidadores,
  getDenunciasFundaciones,
  getDenunciasVeterinarias, 
} from "../../api/denunciasApi";
import CustomLoader from "../../components/CustomLoader";
import VerDenunciasPublicaciones from "./VerDenunciasPublicaciones";
import VerDenunciasPaseadores from "./VerDenunciasPaseadores";
import VerDenunciasCuidadores from "./VerDenunciasCuidadores";
import VerDenunciasFundaciones from "./VerDenunciasFundaciones"; 
import VerDenunciasVeterinarias from "./VerDenunciasVeterinarias"; 
import { useAuth } from "../../auth/AuthProvider";

const PanelDenuncias = () => {
  const { userData } = useAuth();
  const [denunciasPublicaciones, setDenunciasPublicaciones] = useState([]);
  const [denunciasPaseadores, setDenunciasPaseadores] = useState([]);
  const [denunciasCuidadores, setDenunciasCuidadores] = useState([]);
  const [denunciasFundaciones, setDenunciasFundaciones] = useState([]); 
  const [denunciasVeterinarias, setDenunciasVeterinarias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    // Solo cargar denuncias si es administrador
    if (userData?.rolId === 1) {
      const fetchAll = async () => {
        setLoading(true);
        try {
          const [resPub, resPas, resCui, resFun, resVet] = await Promise.all([
            getDenuncias(),
            getDenunciasPaseadores(),
            getDenunciasCuidadores(),
            getDenunciasFundaciones(), 
            getDenunciasVeterinarias(),
          ]);
          setDenunciasPublicaciones(resPub.data || []);
          setDenunciasPaseadores(resPas.data || []);
          setDenunciasCuidadores(resCui.data || []);
          setDenunciasFundaciones(resFun.data || []); 
          setDenunciasVeterinarias(resVet.data || []); 
        } catch (error) {
          console.error("Error al cargar denuncias:", error);
        }
        setLoading(false);
      };
      fetchAll();
    }
  }, [userData]);

  const obtenerRutaPublicacion = (tipo, idPublicacion) => {
    switch (tipo) {
      case "Perdida":
        return `/consultar-posteo-perdida/${idPublicacion}`;
      case "Encontrada":
        return `/consultar-posteo-encontrada/${idPublicacion}`;
      case "Adopcion":
        return `/consultar-posteo-adopcion/${idPublicacion}`;
      default:
        return `/publicacion/${idPublicacion}`;
    }
  };

  // Callbacks para actualizaciones optimistas
  const actualizarDenunciasPublicaciones = (nuevaLista) => {
    setDenunciasPublicaciones(nuevaLista);
  };

  const actualizarDenunciasPaseadores = (nuevaLista) => {
    setDenunciasPaseadores(nuevaLista);
  };

  const actualizarDenunciasCuidadores = (nuevaLista) => {
    setDenunciasCuidadores(nuevaLista);
  };

  const actualizarDenunciasFundaciones = (nuevaLista) => {
    setDenunciasFundaciones(nuevaLista);
  };

  const actualizarDenunciasVeterinarias = (nuevaLista) => {
    setDenunciasVeterinarias(nuevaLista);
  };

  // Verificar si es administrador
  if (!userData || userData.rolId !== 1) {
    return (
      <Container sx={{ mt: 8 }}>
        <Typography variant="h5" color="error" align="center">
          Acceso solo para administradores.
        </Typography>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <CustomLoader />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Panel de Denuncias
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} centered>
          <Tab label="Publicaciones" />
          <Tab label="Paseadores" />
          <Tab label="Cuidadores" />
          <Tab label="Fundaciones" /> 
          <Tab label="Veterinarias" /> 
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CustomLoader />
        </Box>
      ) : (
        <>
          {tabIndex === 0 && (
            <VerDenunciasPublicaciones 
              denuncias={denunciasPublicaciones} 
              onActualizarDenuncias={actualizarDenunciasPublicaciones}
            />
          )}
          {tabIndex === 1 && (
            <VerDenunciasPaseadores 
              denuncias={denunciasPaseadores} 
              onActualizarDenuncias={actualizarDenunciasPaseadores}
            />
          )}
          {tabIndex === 2 && (
            <VerDenunciasCuidadores 
              denuncias={denunciasCuidadores} 
              onActualizarDenuncias={actualizarDenunciasCuidadores}
            />
          )}
          {tabIndex === 3 && (
            <VerDenunciasFundaciones 
              denuncias={denunciasFundaciones} 
              onActualizarDenuncias={actualizarDenunciasFundaciones}
            /> 
          )}
          {tabIndex === 4 && (
            <VerDenunciasVeterinarias 
              denuncias={denunciasVeterinarias} 
              onActualizarDenuncias={actualizarDenunciasVeterinarias}
            /> 
          )}
        </>
      )}
    </Container>
  );
};

export default PanelDenuncias;
