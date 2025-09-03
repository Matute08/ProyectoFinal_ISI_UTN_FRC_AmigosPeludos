import React, { useState, useEffect } from "react";
import { 
  Box, 
  Grid, 
  Typography, 
  Alert,
  Tabs,
  Tab,
  CircularProgress
} from "@mui/material";
import { getUserMail } from "../../../api/userApi";
import { getPaseadores, deletePaseador } from "../../../api/paseadoresApi";
import { getCuidadores, deleteCuidador } from "../../../api/cuidadoresApi";
import { getVeterinarias, deleteVeterinaria } from "../../../api/commonApi";
import { getFundacion, deleteFundacion } from "../../../api/fundacionesApi";
import CardServicio from "../../../components/CardServicio";
import CustomLoader from "../../../components/CustomLoader";
import { mostrarAlertaExito, mostrarAlertaError } from "../../../utils/showAlert";
import Swal from "sweetalert2";

const ServiciosTab = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [servicios, setServicios] = useState({
    paseadores: [],
    cuidadores: [],
    veterinarias: [],
    fundaciones: []
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem("userData"));
        if (localUser?.email) {
          const response = await getUserMail(localUser.email);
          setUserData(response);
          await fetchServicios(response);
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        mostrarAlertaError("Error al cargar los datos del usuario");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const fetchServicios = async (user) => {
    try {
      const serviciosPromises = [];

      if (user.esPaseador) {
        serviciosPromises.push(
          getPaseadores().then(res => ({
            tipo: 'paseadores',
            data: res.data.filter(p => p.idUsuario === user.id)
          }))
        );
      }

      if (user.esCuidador) {
        serviciosPromises.push(
          getCuidadores().then(res => {
            const cuidadoresFiltrados = res.data.filter(c => c.idUsuario === user.id);
            return {
              tipo: 'cuidadores',
              data: cuidadoresFiltrados
            };
          })
        );
      }

      if (user.esVeterinaria) {
        serviciosPromises.push(
          getVeterinarias().then(res => ({
            tipo: 'veterinarias',
            data: res.data.filter(v => v.usuarioId === user.id)
          }))
        );
      }

      if (user.esFundacion) {
        serviciosPromises.push(
          getFundacion().then(res => ({
            tipo: 'fundaciones',
            data: res.data.filter(f => f.usuarioId === user.id)
          }))
        );
      }

      const resultados = await Promise.all(serviciosPromises);
      
      const nuevosServicios = { ...servicios };
      resultados.forEach(resultado => {
        nuevosServicios[resultado.tipo] = resultado.data;
      });
      
      setServicios(nuevosServicios);
    } catch (error) {
      console.error("Error al obtener servicios:", error);
      mostrarAlertaError("Error al cargar los servicios");
    }
  };

  const handleEliminar = async (tipo, id, nombre) => {
    try {
      
      const confirmar = await Swal.fire({
        title: "¿Estás seguro?",
        text: `Esta acción eliminará tu ${tipo}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      });

      if (confirmar.isConfirmed) {
        let deleteFunction;
        switch (tipo) {
          case 'paseador':
            deleteFunction = deletePaseador;
            break;
          case 'cuidador':
            deleteFunction = deleteCuidador;
            break;
          case 'veterinaria':
            deleteFunction = deleteVeterinaria;
            break;
          case 'fundacion':
            deleteFunction = deleteFundacion;
            break;
          default:
            throw new Error('Tipo de servicio no válido');
        }

        await deleteFunction(id);
        
        // Actualizar el estado local
        setServicios(prev => {
          const nuevosServicios = {
            ...prev,
            [tipo + 's']: prev[tipo + 's'].filter(servicio => servicio.id !== id)
          };
          return nuevosServicios;
        });

        mostrarAlertaExito(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} eliminado exitosamente`);
        
        // Redirigir al perfil después de eliminar
        window.location.href = "/perfil";
      }
    } catch (error) {
      console.error(`Error al eliminar ${tipo}:`, error);
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
      console.error("Response headers:", error.response?.headers);
      mostrarAlertaError(`Error al eliminar ${tipo}: ${error.response?.data?.title || error.message}`);
    }
  };

  const getTabsDisponibles = () => {
    const tabs = [];
    if (userData?.esPaseador && servicios.paseadores.length > 0) tabs.push("Paseadores");
    if (userData?.esCuidador && servicios.cuidadores.length > 0) tabs.push("Cuidadores");
    if (userData?.esVeterinaria && servicios.veterinarias.length > 0) tabs.push("Veterinarias");
    if (userData?.esFundacion && servicios.fundaciones.length > 0) tabs.push("Fundaciones");
    return tabs;
  };

  const getServiciosActivos = () => {
    const tabs = getTabsDisponibles();
    if (tabs.length === 0) return [];
    
    const tabActivo = tabs[activeTab];
    switch (tabActivo) {
      case "Paseadores":
        return servicios.paseadores;
      case "Cuidadores":
        return servicios.cuidadores;
      case "Veterinarias":
        return servicios.veterinarias;
      case "Fundaciones":
        return servicios.fundaciones;
      default:
        return [];
    }
  };

  const getTipoServicio = () => {
    const tabs = getTabsDisponibles();
    if (tabs.length === 0) return "";
    
    const tabActivo = tabs[activeTab];
    switch (tabActivo) {
      case "Paseadores":
        return "paseador";
      case "Cuidadores":
        return "cuidador";
      case "Veterinarias":
        return "veterinaria";
      case "Fundaciones":
        return "fundacion";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CustomLoader />
      </Box>
    );
  }

  const tabsDisponibles = getTabsDisponibles();
  const serviciosActivos = getServiciosActivos();
  const tipoServicio = getTipoServicio();

  // Si no hay servicios registrados
  if (tabsDisponibles.length === 0) {
    return (
      <Box sx={{ width: "100%", mt: 2 }}>
        <Alert severity="info">
          No tienes servicios registrados. Puedes agregar servicios desde el menú principal.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      {/* Tabs para diferentes tipos de servicios */}
      {tabsDisponibles.length > 1 && (
        <Tabs
          value={activeTab}
          onChange={(e, newIndex) => setActiveTab(newIndex)}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3 }}
        >
          {tabsDisponibles.map((tab, index) => (
            <Tab label={tab} key={index} />
          ))}
        </Tabs>
      )}

      {/* Contenido de los servicios */}
      <Box>
        {serviciosActivos.length === 0 ? (
          <Alert severity="info">
            No tienes {tipoServicio}s registrados.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {serviciosActivos.map((servicio) => (
              <Grid item size={{xs: 12, sm: 6, md: 5}} key={servicio.id}>
                <CardServicio
                  tipo={tipoServicio}
                  data={servicio}
                  onEliminar={() => handleEliminar(tipoServicio, servicio.id, servicio.nombre || servicio.titulo)}
                  mostrarVer={true}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default ServiciosTab;
