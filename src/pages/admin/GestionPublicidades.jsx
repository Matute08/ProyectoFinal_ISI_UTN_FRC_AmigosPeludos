import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
  Tooltip
} from '@mui/material';
import {
  Delete,
  Edit,
  Visibility,
  VisibilityOff,
  TrendingUp,
  MonetizationOn,
  Schedule,
  LocationOn,
  Info
} from '@mui/icons-material';
import { 
  getAllPublicidades, 
  eliminarPublicidad, 
  cambiarEstadoPublicidad,
  getEstadisticasPublicidades,
  getPreciosUbicaciones,
  actualizarPrecioUbicacion,
  getTiposAnunciante,
  getUbicaciones,
  getEstadosPublicidad
} from '../../api/publicidadesApi';
import Swal from 'sweetalert2';
import { mostrarAlertaExito, mostrarAlertaError } from '../../utils/showAlert';
import { useNavigate } from 'react-router-dom';

const GestionPublicidades = () => {
  const navigate = useNavigate();
  const [publicidades, setPublicidades] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [precios, setPrecios] = useState([]);
  const [tiposAnunciante, setTiposAnunciante] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // PASO 1: Solo cargar publicidades por ahora
      const publicidadesData = await getAllPublicidades();
      setPublicidades(publicidadesData || []);

      // Cargar tipos de anunciante
      try {
        const tiposData = await getTiposAnunciante();
        setTiposAnunciante(tiposData || []);
      } catch (error) {
        console.error('Error al cargar tipos de anunciante:', error);
        setTiposAnunciante([]);
      }

      // Cargar ubicaciones
      try {
        const ubicacionesData = await getUbicaciones();
        setUbicaciones(ubicacionesData || []);
      } catch (error) {
        console.error('Error al cargar ubicaciones:', error);
        setUbicaciones([]);
      }

      // Cargar estados
      try {
        const estadosData = await getEstadosPublicidad();
        setEstados(estadosData || []);
      } catch (error) {
        console.error('Error al cargar estados:', error);
        setEstados([]);
      }

      // Cargar estadísticas
      try {
        const estadisticasData = await getEstadisticasPublicidades();
        setEstadisticas(estadisticasData || {});
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        setEstadisticas({});
      }

      // Cargar precios
      try {
        const preciosData = await getPreciosUbicaciones();
        setPrecios(preciosData || []);
      } catch (error) {
        console.error('Error al cargar precios:', error);
        setPrecios([]);
      }

    } catch (error) {
      console.error('Error al cargar publicidades:', error);
      setPublicidades([]);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que querés eliminar esta publicidad?')) {
      try {
        await eliminarPublicidad(id);
        await fetchData();
      } catch (error) {
        console.error('Error al eliminar publicidad:', error);
      }
    }
  };

  // Función para ver detalles de la publicidad
  const handleVerDetalles = (publicidadId) => {
    navigate(`/ver-publicidad/${publicidadId}`);
  };

  const handleCambiarEstado = async (publicidad) => {
    try {
      // Cargar estados disponibles
      const estados = await getEstadosPublicidad();
      
      // Crear opciones para el select usando el mismo patrón que SolicitudesServiciosAdmin
      const inputOptions = estados.reduce((acc, e) => {
        acc[e.id] = e.nombre;
        return acc;
      }, {});

      const { value: estadoId } = await Swal.fire({
        title: `Cambiar estado de ${publicidad.titulo}`,
        input: "select",
        inputOptions,
        inputPlaceholder: "Seleccione estado",
        showCancelButton: true,
        confirmButtonText: "Actualizar",
        customClass: {
          container: 'swal-over-mui'
        },
        didOpen: () => {
          const swalContainer = document.querySelector('.swal2-container');
          if (swalContainer) {
            swalContainer.style.zIndex = '9999';
          }
        }
      });

      if (estadoId) {
        try {
          await cambiarEstadoPublicidad(publicidad.id, parseInt(estadoId));
          
          // Obtener el nombre del nuevo estado
          const nuevoEstado = estados.find(e => e.id === parseInt(estadoId));
          
          Swal.fire({
            title: "Estado actualizado",
            icon: "success",
            html: "Actualizando vista en <b></b> segundos...",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            didOpen: () => {
              const b = Swal.getHtmlContainer().querySelector("b");
              const timerInterval = setInterval(() => {
                b.textContent = (Swal.getTimerLeft() / 1000).toFixed(1);
              }, 100);
            },
            willClose: () => {
              // Recargar datos
              fetchData();
            }
          });
          
        } catch (error) {
          console.error('Error al cambiar estado:', error);
          mostrarAlertaError('Error al cambiar el estado de la publicidad');
        }
      }
    } catch (error) {
      console.error('Error al cargar estados:', error);
      mostrarAlertaError('Error al cargar los estados disponibles');
    }
  };

  // Función para editar precios usando SweetAlert
  const abrirModalPrecio = async (ubicacion) => {
    const { value: nuevoPrecio } = await Swal.fire({
      title: `Editar precio - ${ubicacion.nombre}`,
      html: `
        <div style="text-align: left; margin: 20px 0;">
          <p><strong>Ubicación:</strong> ${ubicacion.nombre}</p>
          <p><strong>Descripción:</strong> ${ubicacion.descripcion}</p>
          <p><strong>Precio actual:</strong> $${ubicacion.precio.toLocaleString()}</p>
        </div>
        <div style="margin: 20px 0;">
          <label for="precioInput" style="display: block; margin-bottom: 10px; font-weight: bold;">Nuevo precio mensual:</label>
          <input 
            id="precioInput" 
            type="number" 
            value="${ubicacion.precio}"
            min="0" 
            step="0.01"
            style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;"
          />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Actualizar Precio',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2e7d32',
      cancelButtonColor: '#d33',
      preConfirm: () => {
        const inputElement = document.getElementById('precioInput');
        const precio = parseFloat(inputElement.value);
        
        if (isNaN(precio) || precio < 0) {
          Swal.showValidationMessage('Por favor ingrese un precio válido');
          return false;
        }
        
        return precio;
      },
      customClass: {
        container: 'swal-over-mui'
      },
      didOpen: () => {
        // Asegurar que el modal esté por encima de otros elementos
        const swalContainer = document.querySelector('.swal-over-mui');
        if (swalContainer) {
          swalContainer.style.zIndex = '9999';
        }
        
        // Seleccionar todo el texto del input
        const inputElement = document.getElementById('precioInput');
        if (inputElement) {
          inputElement.select();
        }
      }
    });

    if (nuevoPrecio !== undefined) {
      try {
        await actualizarPrecioUbicacion(ubicacion.id, nuevoPrecio);
        
        Swal.fire({
          title: "Precio actualizado",
          icon: "success",
          html: "Actualizando vista en <b></b> segundos...",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          didOpen: () => {
            const b = Swal.getHtmlContainer().querySelector("b");
            const timerInterval = setInterval(() => {
              b.textContent = (Swal.getTimerLeft() / 1000).toFixed(1);
            }, 100);
          },
          willClose: () => {
            // Recargar datos
            fetchData();
          }
        });
      } catch (error) {
        console.error('Error al actualizar precio:', error);
        mostrarAlertaError('Error al actualizar el precio');
      }
    }
  };

  // TODO: Activar cuando esté listo el endpoint de cambio de estado
  // const handleToggleEstado = async (id, estadoActual) => {
  //   try {
  //     const nuevoEstado = estadoActual === 'Activa' ? 'Pausada' : 'Activa';
  //     const estadoData = estados.find(e => e.nombre === nuevoEstado);
  //     if (estadoData) {
  //       await cambiarEstadoPublicidad(id, estadoData.id);
  //       await fetchData();
  //     }
  //   } catch (error) {
  //     console.error('Error al cambiar estado:', error);
  //   }
  // };

  // const getEstadoColor = (estado) => {
  //   switch (estado) {
  //     case 'Activa': return 'success';
  //     case 'Pausada': return 'warning';
  //     case 'Finalizada': return 'error';
  //     default: return 'default';
  //   }
  // };

  // const getUbicacionLabel = (ubicacionCodigo) => {
  //   const ubicacionData = ubicaciones.find(u => u.codigo === ubicacionCodigo);
  //   return ubicacionData ? ubicacionData.nombre : ubicacionCodigo;
  // };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Gestión de Publicidades
      </Typography>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Lista de Publicidades" />
        <Tab label="Estadísticas" />
        <Tab label="Precios" />
      </Tabs>

      {/* Tab 1: Lista de Publicidades */}
      {tabValue === 0 && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">
              Todas las Publicidades ({publicidades.length})
            </Typography>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Imagen</TableCell>
                  <TableCell>Título</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Ubicación</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Período</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {publicidades.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No hay publicidades registradas
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Las nuevas solicitudes aparecerán aquí una vez que los usuarios las envíen
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  publicidades.map((publicidad) => {
                    return (
                  <TableRow key={publicidad.id}>
                    <TableCell>
                      <Box
                        component="img"
                        src={publicidad.imagen || '/placeholder.png'}
                        alt={publicidad.titulo}
                        sx={{
                          width: 60,
                          height: 40,
                          objectFit: 'cover',
                          borderRadius: 1
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {publicidad.titulo}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {publicidad.descripcion?.substring(0, 50)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={typeof publicidad.tipoAnunciante === 'object' ? publicidad.tipoAnunciante?.nombre : publicidad.tipoAnunciante || 'N/A'}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {typeof publicidad.ubicacion === 'object' ? publicidad.ubicacion?.nombre || publicidad.ubicacion?.codigo : publicidad.ubicacion || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={typeof publicidad.estado === 'object' ? publicidad.estado?.nombre : publicidad.estado || 'N/A'}
                        color="default"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {publicidad.fechaInicio ? new Date(publicidad.fechaInicio).toLocaleDateString() : 'N/A'}
                        {publicidad.fechaFin && ` - ${new Date(publicidad.fechaFin).toLocaleDateString()}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            onClick={() => handleVerDetalles(publicidad.id)}
                            color="info"
                          >
                            <Info />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cambiar estado">
                          <IconButton
                            size="small"
                            onClick={() => handleCambiarEstado(publicidad)}
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar publicidad">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(publicidad.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Tab 2: Estadísticas */}
      {tabValue === 1 && (
        <Box>
          {/* Estadísticas originales */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{xs: 12, md:4}} >
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <TrendingUp color="primary" />
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {estadisticas.totalVisualizaciones || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Visualizaciones Totales
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{xs: 12, md:4}} >
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <MonetizationOn color="success" />
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {estadisticas.totalClics || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Clics Totales
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{xs: 12, md:4}} >
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Schedule color="warning" />
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {estadisticas.publicidadesActivas || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Publicidades Activas
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

        </Box>
      )}

      {/* Tab 3: Precios */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          {precios.map((ubicacion) => (
            <Grid size={{xs: 12, md:4}}  key={ubicacion.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <LocationOn color="primary" />
                    <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
                      {ubicacion.nombre}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => abrirModalPrecio(ubicacion)}
                      color="primary"
                      title="Editar precio"
                    >
                      <Edit />
                    </IconButton>
                  </Box>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    ${ubicacion.precio.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    por mes
                  </Typography>
                  {ubicacion.descripcion && (
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      {ubicacion.descripcion}
                    </Typography>
                  )}
                  <Chip
                    label={ubicacion.activo ? "Activo" : "Inactivo"}
                    color={ubicacion.activo ? "success" : "error"}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

    </Container>
  );
};

export default GestionPublicidades;
