import React, { useState, useEffect } from "react";
import { 
  Box, 
  Grid, 
  Typography, 
  Alert,
  Tabs,
  Tab,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getUserMail } from "../../../api/userApi";
import { getPaseadorByUsuario, deletePaseador } from "../../../api/paseadoresApi";
import { getCuidadorByUsuario, deleteCuidador } from "../../../api/cuidadoresApi";
import { getVeterinariaByUsuario, deleteVeterinaria } from "../../../api/commonApi";
import { getFundacionByUsuario } from "../../../api/fundacionesApi";
import { deshabilitarFundacion } from "../../../api/denunciasApi";
import CustomLoader from "../../../components/CustomLoader";
import { mostrarAlertaExito, mostrarAlertaError } from "../../../utils/showAlert";
import Swal from "sweetalert2";

const ServiciosTab = ({ userData }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [servicios, setServicios] = useState({
    paseadores: [],
    cuidadores: [],
    veterinarias: [],
    fundaciones: []
  });

  // Función para asegurar que el estado siempre tenga arrays válidos
  const ensureValidServicios = (serviciosData) => {
    return {
      paseadores: Array.isArray(serviciosData.paseadores) ? serviciosData.paseadores : [],
      cuidadores: Array.isArray(serviciosData.cuidadores) ? serviciosData.cuidadores : [],
      veterinarias: Array.isArray(serviciosData.veterinarias) ? serviciosData.veterinarias : [],
      fundaciones: Array.isArray(serviciosData.fundaciones) ? serviciosData.fundaciones : []
    };
  };

  useEffect(() => {
    const fetchServiciosData = async () => {
      if (userData) {
        try {
          await fetchServicios(userData);
        } catch (error) {
          console.error("Error al obtener servicios:", error);
          mostrarAlertaError("Error al cargar los servicios");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    fetchServiciosData();
  }, [userData]);

  const fetchServicios = async (user) => {
    try {
      const serviciosPromises = [];

      if (user.esPaseador) {
        serviciosPromises.push(
          getPaseadorByUsuario(user.id).then(data => ({
            tipo: 'paseadores',
            data: Array.isArray(data) ? data : (data ? [data] : [])
          })).catch(error => {
            console.error("Error al obtener paseador:", error);
            return {
              tipo: 'paseadores',
              data: []
            };
          })
        );
      }

      if (user.esCuidador) {
        serviciosPromises.push(
          getCuidadorByUsuario(user.id).then(data => ({
            tipo: 'cuidadores',
            data: Array.isArray(data) ? data : (data ? [data] : [])
          })).catch(error => {
            console.error("Error al obtener cuidador:", error);
            return {
              tipo: 'cuidadores',
              data: []
            };
          })
        );
      }

      if (user.esVeterinaria) {
        serviciosPromises.push(
          getVeterinariaByUsuario(user.id).then(data => ({
            tipo: 'veterinarias',
            data: Array.isArray(data) ? data : (data ? [data] : [])
          })).catch(error => {
            console.error("Error al obtener veterinaria:", error);
            return {
              tipo: 'veterinarias',
              data: []
            };
          })
        );
      }

      if (user.esFundacion) {
        serviciosPromises.push(
          getFundacionByUsuario(user.id).then(data => ({
            tipo: 'fundaciones',
            data: Array.isArray(data) ? data : (data ? [data] : [])
          })).catch(error => {
            console.error("Error al obtener fundacion:", error);
            return {
              tipo: 'fundaciones',
              data: []
            };
          })
        );
      }

      const resultados = await Promise.all(serviciosPromises);
      
      const nuevosServicios = {
        paseadores: [],
        cuidadores: [],
        veterinarias: [],
        fundaciones: []
      };
      
      resultados.forEach(resultado => {
        if (resultado && resultado.data) {
          nuevosServicios[resultado.tipo] = resultado.data;
        }
      });
      
      setServicios(ensureValidServicios(nuevosServicios));
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
            deleteFunction = deshabilitarFundacion;
            break;
          default:
            throw new Error('Tipo de servicio no válido');
        }

        await deleteFunction(id);
        
        // Actualizar el estado local
        setServicios(prev => {
          const nuevosServicios = {
            ...prev,
            [tipo + 's']: (prev[tipo + 's'] || []).filter(servicio => servicio.id !== id)
          };
          return ensureValidServicios(nuevosServicios);
        });

        mostrarAlertaExito(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} eliminado exitosamente`);
        
        // Recargar datos
        await fetchServicios(userData);
      }
    } catch (error) {
      console.error(`Error al eliminar ${tipo}:`, error);
      mostrarAlertaError(`Error al eliminar ${tipo}: ${error.response?.data?.title || error.message}`);
    }
  };

  const handleEditar = (tipo, id) => {
    switch (tipo) {
      case 'paseador':
        navigate(`/editar-paseador/${id}`);
        break;
      case 'cuidador':
        navigate(`/editar-cuidador/${id}`);
        break;
      case 'veterinaria':
        navigate(`/editar-veterinaria/${id}`);
        break;
      case 'fundacion':
        navigate(`/editar-fundacion/${id}`);
        break;
      default:
        mostrarAlertaError("Tipo de servicio no válido");
    }
  };

  const getTabsDisponibles = () => {
    const tabs = [];
    if (userData?.esPaseador) tabs.push("Paseadores");
    if (userData?.esCuidador) tabs.push("Cuidadores");
    if (userData?.esVeterinaria) tabs.push("Veterinarias");
    if (userData?.esFundacion) tabs.push("Fundaciones");
    return tabs;
  };

  const getServiciosActivos = () => {
    const tabs = getTabsDisponibles();
    if (tabs.length === 0) return [];
    
    const tabActivo = tabs[activeTab];
    let serviciosArray = [];
    
    switch (tabActivo) {
      case "Paseadores":
        serviciosArray = servicios.paseadores || [];
        break;
      case "Cuidadores":
        serviciosArray = servicios.cuidadores || [];
        break;
      case "Veterinarias":
        serviciosArray = servicios.veterinarias || [];
        break;
      case "Fundaciones":
        serviciosArray = servicios.fundaciones || [];
        break;
      default:
        return [];
    }
    
    // Filtrar solo los servicios que tienen habilitado: true
    return serviciosArray.filter(servicio => servicio.habilitado === true);
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

  const renderTableHeaders = (tipo) => {
    switch (tipo) {
      case "paseador":
        return (
          <>
            <TableCell><strong>Título</strong></TableCell>
            <TableCell><strong>Barrio</strong></TableCell>
            <TableCell><strong>Experiencia</strong></TableCell>
            <TableCell><strong>Precio</strong></TableCell>
            <TableCell><strong>Acciones</strong></TableCell>
          </>
        );
      case "cuidador":
        return (
          <>
            <TableCell><strong>Título</strong></TableCell>
            <TableCell><strong>Barrio</strong></TableCell>
            <TableCell><strong>Experiencia</strong></TableCell>
            <TableCell><strong>Precio </strong></TableCell>
            <TableCell><strong>Acciones</strong></TableCell>
          </>
        );
      case "veterinaria":
        return (
          <>
            <TableCell><strong>Nombre</strong></TableCell>
            <TableCell><strong>Barrio</strong></TableCell>
            <TableCell><strong>Dirección</strong></TableCell>
            <TableCell><strong>Altura</strong></TableCell>
            <TableCell><strong>Acciones</strong></TableCell>
          </>
        );
      case "fundacion":
        return (
          <>
            <TableCell><strong>Nombre</strong></TableCell>
            <TableCell><strong>Barrio</strong></TableCell>
            <TableCell><strong>Dirección</strong></TableCell>
            <TableCell><strong>Altura</strong></TableCell>
            <TableCell><strong>Acciones</strong></TableCell>
          </>
        );
      default:
        return null;
    }
  };

  const renderTableRow = (servicio, tipo) => {
    switch (tipo) {
      case "paseador":
        return (
          <TableRow key={servicio.id}>
            <TableCell>{servicio.titulo || 'N/A'}</TableCell>
            <TableCell>{servicio.barrioTrabajo || 'N/A'}</TableCell>
            <TableCell>{servicio.experiencia || 'N/A'}</TableCell>
            <TableCell>${servicio.precioPaseo || 'N/A'}</TableCell>
            <TableCell>
              <Tooltip title="Editar paseador">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleEditar('paseador', servicio.id)}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar paseador">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleEliminar('paseador', servicio.id, servicio.titulo)}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        );
      case "cuidador":
        return (
          <TableRow key={servicio.id}>
            <TableCell>{servicio.titulo || 'N/A'}</TableCell>
            <TableCell>{servicio.barrio || 'N/A'}</TableCell>
            <TableCell>{servicio.experiencia || 'N/A'}</TableCell>
            <TableCell>${servicio.precioCuidado || 'N/A'}</TableCell>
            <TableCell>
              <Tooltip title="Editar cuidador">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleEditar('cuidador', servicio.id)}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar cuidador">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleEliminar('cuidador', servicio.id, servicio.titulo)}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        );
      case "veterinaria":
        return (
          <TableRow key={servicio.id}>
            <TableCell>{servicio.nombre || 'N/A'}</TableCell>
            <TableCell>{servicio.barrio || 'N/A'}</TableCell>
            <TableCell>{servicio.direccion || 'N/A'}</TableCell>
            <TableCell>{servicio.numeroCalle || 'N/A'}</TableCell>
            <TableCell>
              <Tooltip title="Editar veterinaria">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleEditar('veterinaria', servicio.id)}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar veterinaria">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleEliminar('veterinaria', servicio.id, servicio.nombre)}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        );
      case "fundacion":
        return (
          <TableRow key={servicio.id}>
            <TableCell>{servicio.nombre || 'N/A'}</TableCell>
            <TableCell>{servicio.barrio || 'N/A'}</TableCell>
            <TableCell>{servicio.direccion || 'N/A'}</TableCell>
            <TableCell>{servicio.nroCalle || 'N/A'}</TableCell>
            <TableCell>
              <Tooltip title="Editar fundación">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleEditar('fundacion', servicio.id)}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar fundación">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleEliminar('fundacion', servicio.id, servicio.nombre)}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        );
      default:
        return null;
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

  // Si el usuario no tiene ningún tipo de servicio habilitado
  if (tabsDisponibles.length === 0) {
    return (
      <Box sx={{ width: "100%", mt: 2 }}>
        <Alert severity="info">
          No tienes servicios habilitados.
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
            No tienes {tipoServicio} registrado. Puedes agregar servicios desde el menú principal.
          </Alert>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {renderTableHeaders(tipoServicio)}
                </TableRow>
              </TableHead>
              <TableBody>
                {serviciosActivos.map((servicio) => 
                  renderTableRow(servicio, tipoServicio)
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default ServiciosTab;
