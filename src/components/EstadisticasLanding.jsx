import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Paper,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Pets,
    CheckCircle,
    TrendingUp,
    Timer
} from '@mui/icons-material';
import { getEstadisticasLanding } from '../api/publicacionesApi';

const EstadisticasLanding = () => {
    const [estadisticas, setEstadisticas] = useState({
        publicacionesRealizadas: 0,
        publicacionesFinalizadas: 0,
        tiempoPromedio: 0,
        tasaDeExito: 0
    });
    const [cargando, setCargando] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const cargarEstadisticas = async () => {
            try {
                setCargando(true);
                const data = await getEstadisticasLanding();
                setEstadisticas(data);
            } catch (error) {
                console.error('Error cargando estadísticas:', error);
                // Valores por defecto en caso de error
                setEstadisticas({
                    publicacionesRealizadas: 0,
                    publicacionesFinalizadas: 0,
                    tiempoPromedio: 0,
                    tasaDeExito: 0
                });
            } finally {
                setCargando(false);
            }
        };

        cargarEstadisticas();
    }, []);

    const statsCards = [
        {
            titulo: 'Publicaciones Realizadas',
            valor: estadisticas.publicacionesRealizadas,
            icono: Pets,
            color: '#4caf50',
            descripcion: 'gracias a nuestra comunidad'
        },
        {
            titulo: 'Publicaciones Finalizadas',
            valor: estadisticas.publicacionesFinalizadas,
            icono: CheckCircle,
            color: '#2196f3',
            descripcion: 'casos resueltos exitosamente'
        },
        {
            titulo: 'Tiempo Promedio',
            valor: estadisticas.tiempoPromedio != null ? estadisticas.tiempoPromedio.toFixed(2) : '0.00',
            icono: Timer,
            color: '#ff9800',
            descripcion: 'días hasta encontrar',
            sufijo: ' días'
        },
        {
            titulo: 'Tasa de Éxito',
            valor: estadisticas.tasaDeExito != null ? estadisticas.tasaDeExito.toFixed(2) : '0.00',
            icono: TrendingUp,
            color: '#9c27b0',
            descripcion: 'de casos resueltos',
            sufijo: '%'
        }
    ];

    if (cargando) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                minHeight: 200,
                backgroundColor: '#f8f9fa',
                borderRadius: 3
            }}>
                <Typography 
                    variant="h6" 
                    color="text.secondary"
                    sx={{
                        fontSize: { 
                            xs: '0.9rem', 
                            sm: '1rem', 
                            md: '1.1rem' 
                        }
                    }}
                >
                    Cargando estadísticas...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            backgroundColor: '#f8f9fa',
            borderRadius: 4,
            p: { xs: 3, md: 4 },
            mb: 4
        }}>
            <Typography 
                variant="h4" 
                component="h2"
                sx={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    mb: 3,
                    fontSize: { 
                        xs: '1.2rem', 
                        sm: '1.4rem', 
                        md: '1.6rem', 
                        lg: '1.8rem' 
                    }
                }}
            >
                🎉 Nuestro Impacto en Números
            </Typography>
            
            <Typography 
                variant="subtitle1" 
                sx={{
                    textAlign: 'center',
                    color: '#7f8c8d',
                    mb: 4,
                    fontSize: { 
                        xs: '0.8rem', 
                        sm: '0.9rem', 
                        md: '1rem', 
                        lg: '1.1rem' 
                    }
                }}
            >
                Cada número representa una mascota que volvió a casa con su familia
            </Typography>

            <Grid container spacing={{ xs: 2, md: 3 }}>
                {statsCards.map((stat, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                        <Card 
                            elevation={isMobile ? 1 : 3}
                            sx={{ 
                                height: '100%',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: isMobile ? 'none' : 'translateY(-4px)',
                                    boxShadow: isMobile ? 1 : 6
                                }
                            }}
                        >
                            <CardContent sx={{ 
                                textAlign: 'center',
                                p: { xs: 1.5, sm: 2, md: 3 },
                                '&:last-child': { pb: { xs: 1.5, sm: 2, md: 3 } }
                            }}>
                                {!isMobile && (
                                    <Box sx={{ 
                                        display: 'flex',
                                        justifyContent: 'center',
                                        mb: 2
                                    }}>
                                        <Paper
                                            elevation={2}
                                            sx={{
                                                p: 2,
                                                backgroundColor: stat.color,
                                                color: 'white',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <stat.icono sx={{ fontSize: { sm: '1.2rem', md: '1.4rem', lg: '1.6rem' } }} />
                                        </Paper>
                                    </Box>
                                )}
                                
                                <Typography 
                                    variant="h3" 
                                    component="div"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: stat.color,
                                        mb: { xs: 0.5, md: 1 },
                                        fontSize: { 
                                            xs: '1.5rem', 
                                            sm: '1.6rem', 
                                            md: '1.8rem', 
                                            lg: '2rem' 
                                        }
                                    }}
                                >
                                    {stat.valor}
                                    {stat.sufijo}
                                </Typography>
                                
                                <Typography 
                                    variant="h6" 
                                    component="div"
                                    sx={{
                                        fontWeight: '600',
                                        color: '#2c3e50',
                                        mb: { xs: 0.5, md: 1 },
                                        fontSize: { 
                                            xs: '0.75rem', 
                                            sm: '0.9rem', 
                                            md: '1rem', 
                                            lg: '1.1rem' 
                                        }
                                    }}
                                >
                                    {stat.titulo}
                                </Typography>
                                
                                {!isMobile && (
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{
                                            fontSize: { 
                                                sm: '0.75rem', 
                                                md: '0.8rem', 
                                                lg: '0.9rem' 
                                            }
                                        }}
                                    >
                                        {stat.descripcion}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ 
                textAlign: 'center',
                mt: { xs: 3, md: 4 },
                p: { xs: 2, md: 3 },
                backgroundColor: '#e8f5e8',
                borderRadius: 2,
                border: '2px solid #4caf50'
            }}>
                <Typography 
                    variant="h6" 
                    sx={{
                        color: '#2e7d32',
                        fontWeight: '600',
                        mb: { xs: 0.5, md: 1 },
                        fontSize: { 
                            xs: '0.85rem', 
                            sm: '1rem', 
                            md: '1.1rem', 
                            lg: '1.2rem' 
                        }
                    }}
                >
                    🌟 ¡Sé parte de esta comunidad!
                </Typography>
                {!isMobile && (
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            color: '#388e3c',
                            fontSize: { 
                                sm: '0.8rem', 
                                md: '0.9rem', 
                                lg: '1rem' 
                            }
                        }}
                    >
                        Cada publicación que hagas puede ser la diferencia para una familia que busca a su mascota
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default EstadisticasLanding;
