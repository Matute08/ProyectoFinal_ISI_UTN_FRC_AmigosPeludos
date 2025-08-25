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

const PanelDenuncias = () => {
  const [denunciasPublicaciones, setDenunciasPublicaciones] = useState([]);
  const [denunciasPaseadores, setDenunciasPaseadores] = useState([]);
  const [denunciasCuidadores, setDenunciasCuidadores] = useState([]);
  const [denunciasFundaciones, setDenunciasFundaciones] = useState([]); 
  const [denunciasVeterinarias, setDenunciasVeterinarias] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
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
  }, []);

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
            <VerDenunciasPublicaciones denuncias={denunciasPublicaciones} />
          )}
          {tabIndex === 1 && (
            <VerDenunciasPaseadores denuncias={denunciasPaseadores} />
          )}
          {tabIndex === 2 && (
            <VerDenunciasCuidadores denuncias={denunciasCuidadores} />
          )}
          {tabIndex === 3 && (
            <VerDenunciasFundaciones denuncias={denunciasFundaciones} /> 
          )}
          {tabIndex === 4 && (
            <VerDenunciasVeterinarias denuncias={denunciasVeterinarias} /> 
          )}
        </>
      )}
    </Container>
  );
};

export default PanelDenuncias;
