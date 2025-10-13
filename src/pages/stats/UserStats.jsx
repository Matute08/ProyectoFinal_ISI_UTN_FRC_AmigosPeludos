import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
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
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import {
  TrendingUp,
  Visibility,
  TouchApp,
  BarChart,
  Assessment,
  Edit,
  Delete
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useAuth } from '../../auth/AuthProvider';
import { 
  getPublicidadesUsuario,
  getEstadisticasUsuarioPeriodo,
  getRendimientoUbicacionUsuario,
  getTendenciasCTRUsuario,
  eliminarPublicidad
} from '../../api/publicidadesApi';
import { mostrarAlertaError, mostrarAlertaExito } from '../../utils/showAlert';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  PointElement,
  LineElement
);

const UserStats = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [publicidades, setPublicidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  
  // Estados para el diálogo de confirmación de eliminación
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [publicidadToDelete, setPublicidadToDelete] = useState(null);
  
  // Estados para datos de gráficos
  const [estadisticasPeriodo, setEstadisticasPeriodo] = useState({});
  const [rendimientoUbicacion, setRendimientoUbicacion] = useState([]);
  const [tendenciasCTR, setTendenciasCTR] = useState([]);

  useEffect(() => {
    if (userData?.id) {
      fetchData();
    }
  }, [userData]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Obtener fecha actual y hace 30 días
      const hasta = new Date().toISOString().split('T')[0];
      const desde = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      // Cargar todos los datos en paralelo
      const [publicidadesData, estadisticasData, rendimientoData, tendenciasData] = await Promise.all([
        getPublicidadesUsuario(userData.id),
        getEstadisticasUsuarioPeriodo(userData.id, desde, hasta),
        getRendimientoUbicacionUsuario(userData.id),
        getTendenciasCTRUsuario(userData.id, 30)
      ]);
      
      setPublicidades(publicidadesData || []);
      setEstadisticasPeriodo(estadisticasData || {});
      setRendimientoUbicacion(rendimientoData || []);
      setTendenciasCTR(tendenciasData || []);
      
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      mostrarAlertaError('Error al cargar tus estadísticas');
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas totales
  const estadisticasTotales = publicidades.reduce((acc, pub) => {
    acc.totalVisualizaciones += pub.visualizaciones || 0;
    acc.totalClics += pub.clics || 0;
    acc.totalPublicidades += 1;
    return acc;
  }, {
    totalVisualizaciones: 0,
    totalClics: 0,
    totalPublicidades: 0
  });

  // Calcular CTR (Click Through Rate)
  const ctr = estadisticasTotales.totalVisualizaciones > 0 
    ? ((estadisticasTotales.totalClics / estadisticasTotales.totalVisualizaciones) * 100).toFixed(2)
    : 0;

  // Función para editar publicidad
  const handleEditarPublicidad = (publicidad) => {
    navigate(`/editar-publicidad/${publicidad.id}`, { 
      state: { publicidadData: publicidad } 
    });
  };

  // Función para abrir diálogo de confirmación de eliminación
  const handleEliminarPublicidad = (publicidad) => {
    setPublicidadToDelete(publicidad);
    setOpenDeleteDialog(true);
  };

  // Función para cerrar diálogo de eliminación
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setPublicidadToDelete(null);
  };

  // Función para confirmar eliminación
  const handleConfirmarEliminacion = async () => {
    if (!publicidadToDelete) return;

    try {
      await eliminarPublicidad(publicidadToDelete.id);
      
      // Actualizar la lista de publicidades
      setPublicidades(prev => prev.filter(p => p.id !== publicidadToDelete.id));
      
      mostrarAlertaExito('Publicidad eliminada correctamente');
      handleCloseDeleteDialog();
      
      // Recargar datos para actualizar estadísticas
      fetchData();
    } catch (error) {
      console.error('Error al eliminar publicidad:', error);
      mostrarAlertaError('Error al eliminar la publicidad');
    }
  };

  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    if (typeof estado === 'object') {
      switch (estado.nombre) {
        case 'Activa': return 'success';
        case 'Pausada': return 'warning';
        case 'Pendiente': return 'info';
        case 'Rechazada': return 'error';
        default: return 'default';
      }
    }
    return 'default';
  };

  // Función para obtener el nombre del estado
  const getEstadoNombre = (estado) => {
    if (typeof estado === 'object') {
      return estado.nombre;
    }
    return estado || 'N/A';
  };

  // Configuración de datos para gráfico de rendimiento por publicidad
  const getDatosRendimientoPublicidad = () => {
    const labels = publicidades.map(pub => pub.titulo?.substring(0, 20) + '...' || 'Sin título');
    const visualizaciones = publicidades.map(pub => pub.visualizaciones || 0);
    const clics = publicidades.map(pub => pub.clics || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Visualizaciones',
          data: visualizaciones,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Clics',
          data: clics,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };


  // Configuración de datos para gráfico de tendencias de CTR
  const getDatosTendenciasCTR = () => {
    if (!tendenciasCTR || tendenciasCTR.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    const labels = tendenciasCTR.map(item => new Date(item.fecha).toLocaleDateString());
    const ctrData = tendenciasCTR.map(item => item.ctrPromedio || 0);

    return {
      labels,
      datasets: [
        {
          label: 'CTR (%)',
          data: ctrData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  // Configuración de datos para gráfico de rendimiento por ubicación
  const getDatosRendimientoUbicacion = () => {
    if (!rendimientoUbicacion || rendimientoUbicacion.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    const labels = rendimientoUbicacion.map(item => item.ubicacionNombre || item.ubicacionCodigo || 'Sin nombre');
    const ctrData = rendimientoUbicacion.map(item => item.ctr || 0);

    return {
      labels,
      datasets: [
        {
          label: 'CTR por Ubicación (%)',
          data: ctrData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 205, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 5 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando tus estadísticas...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Mis Estadísticas de Publicidad
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Gestiona y visualiza el rendimiento de tus publicidades
      </Typography>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Mis Publicidades" />
        <Tab label="Dashboard" />
      </Tabs>

      {/* Tab 1: Mis Publicidades */}
      {tabValue === 0 && (
        <Box>
          {/* Estadísticas generales */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <TrendingUp color="primary" />
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {estadisticasTotales.totalPublicidades}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Publicidades Totales
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Visibility color="info" />
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {estadisticasTotales.totalVisualizaciones.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Visualizaciones
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <TouchApp color="success" />
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {estadisticasTotales.totalClics.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Clics Totales
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Assessment color="warning" />
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {ctr}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        CTR Promedio
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tabla de publicidades */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detalle de Publicidades
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Imagen</TableCell>
                      <TableCell>Título</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Ubicación</TableCell>
                      <TableCell>Visualizaciones</TableCell>
                      <TableCell>Clics</TableCell>
                      <TableCell>CTR</TableCell>
                      <TableCell>Fecha Creación</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {publicidades.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            No tienes publicidades registradas
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Crea tu primera publicidad para ver estadísticas aquí
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      publicidades.map((publicidad) => {
                        const ctrPublicidad = publicidad.visualizaciones > 0 
                          ? ((publicidad.clics / publicidad.visualizaciones) * 100).toFixed(2)
                          : 0;

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
                                label={getEstadoNombre(publicidad.estado)}
                                color={getEstadoColor(publicidad.estado)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {typeof publicidad.ubicacion === 'object' 
                                  ? publicidad.ubicacion?.nombre || publicidad.ubicacion?.codigo 
                                  : publicidad.ubicacion || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold">
                                {publicidad.visualizaciones?.toLocaleString() || 0}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold">
                                {publicidad.clics?.toLocaleString() || 0}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold">
                                {ctrPublicidad}%
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption">
                                {publicidad.fechaCreacion 
                                  ? new Date(publicidad.fechaCreacion).toLocaleDateString()
                                  : 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title={publicidad.estadoPublicidadId === 6 ? "No se puede editar una publicidad eliminada" : "Editar publicidad"}>
                                  <span>
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() => handleEditarPublicidad(publicidad)}
                                      disabled={publicidad.estadoPublicidadId === 6}
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                                <Tooltip title={publicidad.estadoPublicidadId === 6 ? "No se puede eliminar una publicidad ya eliminada" : "Eliminar publicidad"}>
                                  <span>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleEliminarPublicidad(publicidad)}
                                      disabled={publicidad.estadoPublicidadId === 6}
                                    >
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  </span>
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
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Tab 2: Dashboard */}
      {tabValue === 1 && (
        <Box>
          <Grid container spacing={3}>
            {/* Gráfico de rendimiento por publicidad */}
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Rendimiento por Publicidad
                  </Typography>
                  {publicidades.length > 0 ? (
                    <Box sx={{ height: 300 }}>
                      <Bar 
                        data={getDatosRendimientoPublicidad()} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top',
                            },
                            title: {
                              display: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                            },
                          },
                        }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="body1" color="text.secondary">
                        No hay datos para mostrar
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>


            {/* Métricas de rendimiento */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tendencias de CTR (Últimos 30 días)
                  </Typography>
                  {tendenciasCTR.length > 0 ? (
                    <Box sx={{ height: 250 }}>
                      <Line 
                        data={getDatosTendenciasCTR()} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: 'CTR (%)'
                              }
                            },
                            x: {
                              title: {
                                display: true,
                                text: 'Fecha'
                              }
                            }
                          },
                        }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="body1" color="text.secondary">
                        No hay datos de tendencias disponibles
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Comparación de ubicaciones */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Rendimiento por Ubicación
                  </Typography>
                  {rendimientoUbicacion.length > 0 ? (
                    <Box sx={{ height: 250 }}>
                      <Bar 
                        data={getDatosRendimientoUbicacion()} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: 'CTR (%)'
                              }
                            },
                            x: {
                              title: {
                                display: true,
                                text: 'Ubicación'
                              }
                            }
                          },
                        }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="body1" color="text.secondary">
                        No hay datos de ubicaciones disponibles
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Diálogo de confirmación para eliminar publicidad */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main' }}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar la publicidad "{publicidadToDelete?.titulo}"?
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmarEliminacion} 
            color="error" 
            variant="contained"
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserStats;
