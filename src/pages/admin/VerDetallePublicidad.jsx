import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  Visibility,
  TouchApp,
  LocationOn,
  Phone,
  Link as LinkIcon,
  Email,
  Person,
  CalendarToday,
  Assessment,
  TrendingUp,
  MonetizationOn,
  Schedule,
  Edit,
  Delete
} from '@mui/icons-material';
import { getAllPublicidades } from '../../api/publicidadesApi';
import { mostrarAlertaError } from '../../utils/showAlert';

const VerDetallePublicidad = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [publicidad, setPublicidad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicidad = async () => {
      try {
        setLoading(true);
        const publicidades = await getAllPublicidades();
        const publicidadEncontrada = publicidades.find(p => p.id === parseInt(id));
        
        if (publicidadEncontrada) {
          setPublicidad(publicidadEncontrada);
        } else {
          setError('Publicidad no encontrada');
        }
      } catch (err) {
        console.error('Error al cargar publicidad:', err);
        setError('Error al cargar los datos de la publicidad');
        mostrarAlertaError('Error al cargar los datos de la publicidad');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicidad();
  }, [id]);

  const getEstadoColor = (estado) => {
    if (typeof estado === 'object') {
      switch (estado.nombre) {
        case 'Activa': return 'success';
        case 'Pausada': return 'warning';
        case 'Pendiente': return 'info';
        case 'Rechazada': return 'error';
        case 'Finalizada': return 'default';
        case 'Eliminada': return 'error';
        default: return 'default';
      }
    }
    return 'default';
  };

  const getEstadoNombre = (estado) => {
    if (typeof estado === 'object') {
      return estado.nombre;
    }
    return estado || 'N/A';
  };

  const calcularCTR = () => {
    if (publicidad?.visualizaciones > 0) {
      return ((publicidad.clics / publicidad.visualizaciones) * 100).toFixed(2);
    }
    return '0.00';
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 5 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando detalles de la publicidad...
        </Typography>
      </Container>
    );
  }

  if (error || !publicidad) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'No se pudo cargar la publicidad'}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/gestion-publicidades')}
          variant="outlined"
        >
          Volver a Gestión de Publicidades
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
          Detalles de Publicidad
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Información completa de la publicidad seleccionada
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Columna Izquierda - Información Principal */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Imagen de la Publicidad */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Imagen de la Publicidad
              </Typography>
              {publicidad.imagen ? (
                <Box
                  component="img"
                  src={publicidad.imagen}
                  alt={publicidad.titulo}
                  sx={{
                    width: '100%',
                    maxHeight: 400,
                    objectFit: 'contain',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <Box
                sx={{
                  display: publicidad.imagen ? 'none' : 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 200,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 2,
                  border: '2px dashed #ccc'
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No hay imagen disponible
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Información Básica */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información Básica
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Assessment />
                  </ListItemIcon>
                  <ListItemText
                    primary="Título"
                    secondary={publicidad.titulo || 'N/A'}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Assessment />
                  </ListItemIcon>
                  <ListItemText
                    primary="Descripción"
                    secondary={publicidad.descripcion || 'N/A'}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <LinkIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="URL de Destino"
                     secondary={
                       publicidad.url ? (
                         <Button
                           variant="text"
                           color="primary"
                           onClick={() => window.open(publicidad.url, '_blank', 'noopener,noreferrer')}
                           startIcon={<LinkIcon />}
                           sx={{ textTransform: 'none', justifyContent: 'flex-start', p: 0 }}
                         >
                           {publicidad.url}
                         </Button>
                       ) : 'N/A'
                     }
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText
                    primary="Teléfono de Contacto"
                    secondary={publicidad.telefono || 'N/A'}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <LocationOn />
                  </ListItemIcon>
                  <ListItemText
                    primary="Dirección"
                    secondary={publicidad.direccion || 'N/A'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Clasificación */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Clasificación
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Tipo de Anunciante
                    </Typography>
                    <Chip
                      label={
                        typeof publicidad.tipoAnunciante === 'object'
                          ? publicidad.tipoAnunciante?.nombre
                          : publicidad.tipoAnunciante || 'N/A'
                      }
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Ubicación
                    </Typography>
                    <Chip
                      label={
                        typeof publicidad.ubicacion === 'object'
                          ? publicidad.ubicacion?.nombre || publicidad.ubicacion?.codigo
                          : publicidad.ubicacion || 'N/A'
                      }
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Columna Derecha - Estadísticas y Estado */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Estado */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estado Actual
              </Typography>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Chip
                  label={getEstadoNombre(publicidad.estado)}
                  color={getEstadoColor(publicidad.estado)}
                  size="large"
                  sx={{ fontSize: '1rem', py: 2, px: 3 }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Métricas de Rendimiento */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Métricas de Rendimiento
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
                    <Visibility color="primary" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      {publicidad.visualizaciones?.toLocaleString() || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Visualizaciones
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#e8f5e8', borderRadius: 1 }}>
                    <TouchApp color="success" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h4" color="success.main" fontWeight="bold">
                      {publicidad.clics?.toLocaleString() || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Clics
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fff3e0', borderRadius: 1, mt: 1 }}>
                    <TrendingUp color="warning" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h4" color="warning.main" fontWeight="bold">
                      {calcularCTR()}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      CTR (Click Through Rate)
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Fechas */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
             
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText
                    primary="Fecha de Creación"
                    secondary={formatearFecha(publicidad.fechaCreacion)}
                  />
                </ListItem>
               
              </List>
            </CardContent>
          </Card>

          {/* Información del Usuario */}
          {publicidad.usuario && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Información del Anunciante
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {publicidad.usuario.nombre || publicidad.usuario.nombreCompleto || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Anunciante
                    </Typography>
                  </Box>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={publicidad.usuario.email || 'N/A'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText
                      primary="Teléfono"
                      secondary={publicidad.usuario.telefono || 'N/A'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Acciones */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/gestion-publicidades')}
        >
          Volver a Gestión
        </Button>
        
      </Box>
    </Container>
  );
};

export default VerDetallePublicidad;
