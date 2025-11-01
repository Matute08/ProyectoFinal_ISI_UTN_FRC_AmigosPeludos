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
  Tooltip,
  TextField,
  Button,
  Stack,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem
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
  Info,
  AttachMoney,
  People,
  Payment,
  BarChart,
  CreditCard
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
  getEstadosPublicidad,
  getEstadisticasPagos,
  getEstadisticasPorUbicacion,
  getEstadisticasDetalladasUbicacion
} from '../../api/publicidadesApi';
import apiClient from '../../api/apiClient';
import Swal from 'sweetalert2';
import { mostrarAlertaExito, mostrarAlertaError } from '../../utils/showAlert';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart as RechartsBarChart, Bar } from 'recharts';

const GestionPublicidades = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [publicidades, setPublicidades] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [estadisticasPagos, setEstadisticasPagos] = useState({});
  const [estadisticasUbicacion, setEstadisticasUbicacion] = useState({});
  const [precios, setPrecios] = useState([]);
  const [tiposAnunciante, setTiposAnunciante] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [loadingPagos, setLoadingPagos] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [filtroEstado, setFiltroEstado] = useState('todos');

  // Función para filtrar publicidades por estado
  const filtrarPublicidadesPorEstado = (publicidades) => {
    if (filtroEstado === 'todos') {
      return publicidades;
    }
    
    return publicidades.filter(publicidad => {
      const estadoNombre = typeof publicidad.estado === 'object' ? publicidad.estado?.nombre : publicidad.estado;
      return estadoNombre === filtroEstado;
    });
  };

  // Función para ordenar publicidades (pendientes primero)
  const ordenarPublicidades = (publicidades) => {
    return [...publicidades].sort((a, b) => {
      const estadoA = typeof a.estado === 'object' ? a.estado?.nombre : a.estado;
      const estadoB = typeof b.estado === 'object' ? b.estado?.nombre : b.estado;
      
      // Pendientes primero
      if (estadoA === 'Pendiente' && estadoB !== 'Pendiente') return -1;
      if (estadoA !== 'Pendiente' && estadoB === 'Pendiente') return 1;
      
      // Si ambos son del mismo tipo de estado, mantener orden original
      return 0;
    });
  };

  // Función para obtener publicidades filtradas, ordenadas y paginadas
  const getPublicidadesPaginadas = () => {
    const publicidadesFiltradas = filtrarPublicidadesPorEstado(publicidades);
    const publicidadesOrdenadas = ordenarPublicidades(publicidadesFiltradas);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return publicidadesOrdenadas.slice(startIndex, endIndex);
  };

  // Función para obtener publicidades filtradas (para calcular total de páginas)
  const getPublicidadesFiltradas = () => {
    return filtrarPublicidadesPorEstado(publicidades);
  };

  // Función para calcular total de páginas basado en publicidades filtradas
  const totalPages = Math.ceil(getPublicidadesFiltradas().length / itemsPerPage);

  // Resetear página cuando cambien las publicidades o el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [publicidades.length, filtroEstado]);

  useEffect(() => {
    // Establecer fechas por defecto (hoy y un mes antes)
    const hoy = new Date();
    const unMesAtras = new Date();
    unMesAtras.setMonth(hoy.getMonth() - 1);
    
    const fechaHastaStr = hoy.toISOString().split('T')[0];
    const fechaDesdeStr = unMesAtras.toISOString().split('T')[0];
    
    setFechaHasta(fechaHastaStr);
    setFechaDesde(fechaDesdeStr);
    
    fetchData();
  }, []);

  // Efecto para cargar estadísticas de pagos y ubicaciones cuando cambien las fechas o el usuario
  useEffect(() => {
    if (userData?.rolId === 1 && fechaDesde && fechaHasta) {
      const cargarEstadisticas = async () => {
        try {
          setLoadingPagos(true);
          
          // Cargar estadísticas de pagos
          const pagosData = await getEstadisticasPagos(fechaDesde, fechaHasta);
          setEstadisticasPagos(pagosData || {});
          
          // Cargar estadísticas por ubicación
          const ubicacionData = await getEstadisticasPorUbicacion(fechaDesde, fechaHasta);
          setEstadisticasUbicacion(ubicacionData || {});
          
        } catch (error) {
          console.error('Error al cargar estadísticas:', error);
          setEstadisticasPagos({});
          setEstadisticasUbicacion({});
        } finally {
          setLoadingPagos(false);
        }
      };
      
      cargarEstadisticas();
    }
  }, [fechaDesde, fechaHasta, userData?.rolId]);

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

      // Las estadísticas de pagos se cargarán en el useEffect cuando las fechas estén listas

    } catch (error) {
      console.error('Error al cargar publicidades:', error);
      setPublicidades([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar estadísticas de pagos y ubicaciones (llamada manual)
  const actualizarEstadisticasPagos = async () => {
    if (userData?.rolId !== 1 || !fechaDesde || !fechaHasta) return;
    
    try {
      setLoadingPagos(true);
      
      // Cargar estadísticas de pagos
      const pagosData = await getEstadisticasPagos(fechaDesde, fechaHasta);
      setEstadisticasPagos(pagosData || {});
      
      // Cargar estadísticas por ubicación
      const ubicacionData = await getEstadisticasPorUbicacion(fechaDesde, fechaHasta);
      setEstadisticasUbicacion(ubicacionData || {});
      
    } catch (error) {
      console.error('Error al actualizar estadísticas:', error);
      setEstadisticasPagos({});
      setEstadisticasUbicacion({});
    } finally {
      setLoadingPagos(false);
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

  // Función para crear preferencia de pago
  const handleCrearPago = async (publicidadId) => {
    try {
      // Verificar que la publicidad existe y obtener sus datos
      const publicidad = publicidades.find(p => p.id === parseInt(publicidadId));
      
      if (!publicidad) {
        Swal.fire({
          title: 'Error',
          text: 'No se encontró la publicidad seleccionada',
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
        return;
      }

      // Verificar que el usuario actual es el dueño de la publicidad
      if (publicidad.usuarioId !== userData?.id) {
        Swal.fire({
          title: 'Acceso Denegado',
          text: 'Solo el dueño de la publicidad puede procesar el pago',
          icon: 'warning',
          confirmButtonText: 'Entendido'
        });
        return;
      }

      // Mostrar confirmación antes de proceder
      const confirmacion = await Swal.fire({
        title: 'Procesar Pago',
        text: `¿Estás seguro de que querés proceder con el pago de "${publicidad.titulo}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, proceder',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#2e7d32',
        cancelButtonColor: '#d33'
      });

      if (!confirmacion.isConfirmed) {
        return;
      }

      // Mostrar loading
      Swal.fire({
        title: 'Procesando pago...',
        text: 'Creando preferencia de pago con Mercado Pago',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Obtener la URL base actual
      const baseUrl = window.location.origin;
      
      // Crear preferencia de pago usando apiClient
      const response = await apiClient.post('/pagos/crear-preferencia', {
        publicidadId: publicidadId,
        successUrl: `${baseUrl}/mis-estadisticas?pago=exitoso`,
        failureUrl: `${baseUrl}/mis-estadisticas?pago=fallido`
      });

      const data = response.data;

      if (data.exito) {
        // Cerrar loading
        Swal.close();
        
        // Redirigir al usuario a Mercado Pago
        window.location.href = data.urlPago;
      } else {
        Swal.fire({
          title: 'Error',
          text: data.mensaje || 'Error al crear la preferencia de pago',
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
      }
    } catch (error) {
      console.error('Error al crear preferencia de pago:', error);
      
      // Manejar diferentes tipos de errores
      let errorMessage = 'Error de conexión. Por favor, intentá nuevamente.';
      
      if (error.response?.data?.mensaje) {
        errorMessage = error.response.data.mensaje;
      } else if (error.response?.status === 404) {
        errorMessage = 'El servicio de pagos no está disponible en este momento.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Error interno del servidor. Por favor, intentá más tarde.';
      }
      
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    }
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
              Todas las Publicidades ({getPublicidadesFiltradas().length})
            </Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Filtrar por Estado</InputLabel>
              <Select
                value={filtroEstado}
                label="Filtrar por Estado"
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <MenuItem value="todos">Todos los Estados</MenuItem>
                {estados.map((estado) => (
                  <MenuItem key={estado.id} value={estado.nombre}>
                    {estado.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                {getPublicidadesFiltradas().length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        {filtroEstado === 'todos' 
                          ? 'No hay publicidades registradas'
                          : `No hay publicidades con estado "${filtroEstado}"`
                        }
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {filtroEstado === 'todos' 
                          ? 'Las nuevas solicitudes aparecerán aquí una vez que los usuarios las envíen'
                          : 'Intenta cambiar el filtro para ver otras publicidades'
                        }
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  getPublicidadesPaginadas().map((publicidad) => {
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
                         {/* Botón de pago - Solo se muestra cuando el estado es Pre-Aprobada (id=7) y el usuario es el dueño */}
                         {(() => {
                           const estadoId = typeof publicidad.estado === 'object' ? publicidad.estado?.id : null;
                           const esDueño = publicidad.usuarioId === userData?.id;
                           
                           return (estadoId === 7 && esDueño) ? (
                             <Tooltip title="Procesar pago">
                               <IconButton
                                 size="small"
                                 onClick={() => handleCrearPago(publicidad.id)}
                                 color="success"
                                 sx={{
                                   backgroundColor: '#2e7d32',
                                   color: 'white',
                                   '&:hover': {
                                     backgroundColor: '#27642a'
                                   }
                                 }}
                               >
                                 <CreditCard />
                               </IconButton>
                             </Tooltip>
                           ) : null;
                         })()}
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
          
          {/* Controles de paginación */}
          {getPublicidadesFiltradas().length > 0 && totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, page) => setCurrentPage(page)}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
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

          {/* Dashboard de Ganancias - Solo para Admin */}
          {userData?.rolId === 1 && (
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                Dashboard de Ganancias
              </Typography>
              
              {/* Selector de fechas */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Seleccionar Período
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Período actual: {fechaDesde && fechaHasta ? 
                      `${new Date(fechaDesde).toLocaleDateString('es-ES')} - ${new Date(fechaHasta).toLocaleDateString('es-ES')}` : 
                      'Seleccionando fechas...'
                    }
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                    <TextField
                      label="Desde"
                      type="date"
                      value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                    />
                    <TextField
                      label="Hasta"
                      type="date"
                      value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                    />
                    <Button
                      variant="contained"
                      onClick={actualizarEstadisticasPagos}
                      disabled={loadingPagos || !fechaDesde || !fechaHasta}
                      startIcon={loadingPagos ? <CircularProgress size={16} /> : null}
                    >
                      {loadingPagos ? 'Cargando...' : 'Actualizar'}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
              
              {/* Estadísticas de Pagos */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{xs: 12, md:3}} >
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <AttachMoney color="success" />
                        <Box>
                          <Typography variant="h4" fontWeight="bold" color="success.main">
                            ${(estadisticasPagos.totalRecaudado || 0).toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Recaudado
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{xs: 12, md:3}} >
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Payment color="primary" />
                        <Box>
                          <Typography variant="h4" fontWeight="bold">
                            {estadisticasPagos.totalPagos || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Pagos
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{xs: 12, md:3}} >
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <BarChart color="info" />
                        <Box>
                          <Typography variant="h4" fontWeight="bold">
                            ${(estadisticasPagos.promedioPago || 0).toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Promedio por Pago
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{xs: 12, md:3}} >
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <People color="warning" />
                        <Box>
                          <Typography variant="h4" fontWeight="bold">
                            {estadisticasPagos.usuariosUnicos || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Usuarios Únicos
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              

              {/* Gráficos */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Gráfico de líneas - Pagos por Mes */}
                

                
                </Grid>

              {/* Gráficos de Estadísticas por Ubicación */}
              {estadisticasUbicacion.estadisticasPorUbicacion && estadisticasUbicacion.estadisticasPorUbicacion.length > 0 && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {/* Gráfico de barras - Recaudación por Ubicación */}
                  <Grid size={{xs: 12, md:8}} >
                    <Card>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Recaudación por Ubicación
                        </Typography>
                        <Box sx={{ height: 300 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={estadisticasUbicacion.estadisticasPorUbicacion}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="ubicacionNombre" 
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                fontSize={12}
                              />
                              <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                              <RechartsTooltip 
                                formatter={(value) => [`$${value.toLocaleString()}`, 'Total Recaudado']}
                              />
                              <Bar 
                                dataKey="totalRecaudado" 
                                fill="#1976d2"
                                radius={[4, 4, 0, 0]}
                              />
                            </RechartsBarChart>
                          </ResponsiveContainer>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Gráfico de torta - Distribución de Publicidades por Ubicación */}
                  <Grid size={{xs: 12, md:4}} >
                    <Card>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Distribución de Publicidades
                        </Typography>
                        <Box sx={{ height: 300 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={estadisticasUbicacion.estadisticasPorUbicacion}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ ubicacionNombre, totalPublicidades }) => `${ubicacionNombre}: ${totalPublicidades}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="totalPublicidades"
                              >
                                {estadisticasUbicacion.estadisticasPorUbicacion.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={['#1976d2', '#2e7d32', '#ed6c02', '#d32f2f'][index % 4]} />
                                ))}
                              </Pie>
                              <RechartsTooltip 
                                formatter={(value) => [value, 'Publicidades']}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}


              {/* Tabla detallada de ubicaciones */}
              {estadisticasUbicacion.estadisticasPorUbicacion && estadisticasUbicacion.estadisticasPorUbicacion.length > 0 && (
                <Card sx={{ mb: 4 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Detalle por Ubicación
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Ubicación</TableCell>
                            <TableCell>Precio Base</TableCell>
                            <TableCell>Total Publicidades</TableCell>
                            <TableCell>Total Recaudado</TableCell>
                            <TableCell>Promedio por Publicidad</TableCell>
                            <TableCell>Usuarios Únicos</TableCell>
                            <TableCell>Activas/Inactivas</TableCell>
                            <TableCell>Rentabilidad</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {estadisticasUbicacion.estadisticasPorUbicacion.map((ubicacion, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {ubicacion.ubicacionNombre}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  ${ubicacion.precioUbicacion.toLocaleString()}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {ubicacion.totalPublicidades}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight="bold" color="success.main">
                                  ${ubicacion.totalRecaudado.toLocaleString()}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  ${ubicacion.promedioPorPublicidad.toLocaleString()}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {ubicacion.totalUsuariosUnicos}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" gap={1}>
                                  <Chip 
                                    label={`${ubicacion.publicidadesActivas} activas`} 
                                    size="small" 
                                    color="success" 
                                    variant="outlined"
                                  />
                                  <Chip 
                                    label={`${ubicacion.publicidadesInactivas} inactivas`} 
                                    size="small" 
                                    color="error" 
                                    variant="outlined"
                                  />
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={`${ubicacion.rentabilidad.toFixed(1)}x`} 
                                  size="small" 
                                  color="primary" 
                                  variant="filled"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              )}

            </Box>
          )}

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
