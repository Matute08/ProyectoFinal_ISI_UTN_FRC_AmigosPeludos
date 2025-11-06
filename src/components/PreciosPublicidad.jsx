import React, { useState, useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Button,
    useTheme,
} from "@mui/material";
import {
    LocationOn,
    TrendingUp,
    Visibility,
    MonetizationOn,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getPreciosUbicaciones } from "../api/publicidadesApi";

const PreciosPublicidad = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [precios, setPrecios] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cargar precios desde la API
    useEffect(() => {
        const cargarPrecios = async () => {
            try {
                setLoading(true);
                const preciosData = await getPreciosUbicaciones();
                setPrecios(preciosData || []);
            } catch (error) {
                console.error('Error al cargar precios:', error);
                setPrecios([]);
            } finally {
                setLoading(false);
            }
        };

        cargarPrecios();
    }, []);

    const handleContactar = (ubicacion) => {
        // Redirigir al formulario de registro con la ubicación seleccionada
        const ubicacionData = {
            id: ubicacion.id,
            nombre: ubicacion.nombre,
            descripcion: ubicacion.descripcion,
            precio: ubicacion.precio,
            codigo: ubicacion.codigo
        };
        
        navigate('/ads/registro', { 
            state: { 
                planPublicidad: ubicacionData,
                ubicacionId: ubicacion.id  // Pasar el ID directamente
            } 
        });
    };


    // Mapear los precios de la API al formato esperado por el componente
    const mapearUbicaciones = (preciosData) => {
        return preciosData.map((precio, index) => {
            let icono, color, caracteristicas, ubicaciones;
            
            // Mapear según el código de la ubicación
            if (precio.codigo === "HOME_CAROUSEL") {
                icono = <TrendingUp />;
                color = "primary";
                caracteristicas = [
                    "Máxima visibilidad en página principal",
                    "Rotación automática cada 5 segundos",
                    "Métricas de clics y visualizaciones",
                    "Ideal para servicios generales y marcas"
                ];
                ubicaciones = ["Home"];
            } else if (precio.codigo === "SIDEBAR") {
                icono = <Visibility />;
                color = "secondary";
                caracteristicas = [
                    "Alta relevancia contextual",
                    "Posición superior en páginas de alto tráfico",
                    "Diseño responsive optimizado",
                    "Rotación automática cada 5 segundos",
                    "Métricas de clics y visualizaciones"
                ];
                ubicaciones = ["Encontrados", "Perdidos", "Adopción"];
            } else {
                // Fallback para ubicaciones no reconocidas
                icono = <MonetizationOn />;
                color = "default";
                caracteristicas = [
                    "Ubicación estratégica",
                    "Métricas de rendimiento",
                    "Soporte técnico incluido"
                ];
                ubicaciones = [precio.nombre];
            }

            return {
                ...precio,
                caracteristicas,
                icono,
                color,
                popular: false,
                ubicaciones
            };
        });
    };

    // Ordenar las ubicaciones según el orden deseado: HOME (id: 1) - PUBLICACIONES (id: 2) - FULL (id: 4)
    const ordenarUbicaciones = (ubicaciones) => {
        const orden = [1, 2, 4]; // HOME, PUBLICACIONES, FULL
        return ubicaciones.sort((a, b) => {
            const indexA = orden.indexOf(a.id);
            const indexB = orden.indexOf(b.id);
            return indexA - indexB;
        });
    };

    const ubicaciones = ordenarUbicaciones(mapearUbicaciones(precios));

    const beneficios = [
        "Métricas detalladas de rendimiento",
        "Soporte técnico incluido",
        "Actualizaciones en tiempo real",
    ];

    return (
        <Box
            component="div"
            sx={{
                width: "100%",
                maxWidth: "1200px",
                margin: "0 auto",
                padding: { xs: "16px", sm: "24px" },
                backgroundColor: "#e0d0b8",
                borderRadius: 2,
                boxShadow: theme.shadows[1],
                height: "fit-content",
            }}
        >
            {/* Título de la sección */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                        fontWeight: "bold",
                        color: theme.palette.text.primary,
                        mb: 1,
                        fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
                    }}
                >
                    Planes de Publicidad
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: theme.palette.text.secondary,
                        maxWidth: "600px",
                        mx: "auto",
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                    }}
                >
                    Llegá a miles de amantes de las mascotas con nuestras
                    opciones de publicidad estratégicamente ubicadas
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        Cargando planes de publicidad...
                    </Typography>
                </Box>
            ) : ubicaciones.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        No hay planes de publicidad disponibles en este momento.
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={2} justifyContent="center">
                    {ubicaciones.map((ubicacion, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                        <Card
                            sx={{
                                height: "100%",
                                position: "relative",
                                 border: "1px solid #e0e0e0",
                                borderRadius: 3,
                                transition: "all 0.3s ease",
                                backgroundColor: "white",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                                     borderColor: "#3498db",
                                },
                            }}
                        >

                            <CardContent
                                sx={{
                                    p: 2,
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {/* Header */}
                                <Box textAlign="center" mb={2}>
                                    <Box
                                        sx={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 40,
                                            height: 40,
                                            borderRadius: "50%",
                                             backgroundColor: "#3498db",
                                            color: "white",
                                            mb: 1,
                                            boxShadow:
                                                "0 2px 8px rgba(0,0,0,0.1)",
                                        }}
                                    >
                                        {ubicacion.icono}
                                    </Box>

                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        gutterBottom
                                        sx={{
                                            color: "#2c3e50",
                                            fontSize: "1rem",
                                            lineHeight: 1.2,
                                            mb: 0.5,
                                        }}
                                    >
                                        {ubicacion.nombre}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#5a6c7d",
                                            mb: 1,
                                            lineHeight: 1.3,
                                            fontSize: "0.75rem",
                                        }}
                                    >
                                        {ubicacion.descripcion}
                                    </Typography>

                                    {/* Ubicaciones específicas */}
                                    <Box sx={{ mb: 1.5 }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: 0.3,
                                                justifyContent: "center",
                                            }}
                                        >
                                            {ubicacion.ubicaciones.map(
                                                (pagina, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        label={pagina}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor:
                                                                theme.palette
                                                                    .primary
                                                                    .main,
                                                            color: "white",
                                                            fontSize: "0.65rem",
                                                            height: 18,
                                                            "& .MuiChip-label":
                                                                {
                                                                    px: 0.5,
                                                                },
                                                        }}
                                                    />
                                                )
                                            )}
                                        </Box>
                                    </Box>

                                    <Box
                                        display="flex"
                                        alignItems="baseline"
                                        justifyContent="center"
                                        gap={0.5}
                                    >
                                        <Typography
                                            variant="h5"
                                            fontWeight="bold"
                                             sx={{
                                                 color: "#2c3e50",
                                                fontSize: "1.3rem",
                                            }}
                                        >
                                            ${ubicacion.precio.toLocaleString()}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#5a6c7d",
                                                fontSize: "0.8rem",
                                            }}
                                        >
                                            /mes
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Características */}
                                <Box flexGrow={1} mb={1.5}>
                                    <Typography
                                        variant="subtitle2"
                                        fontWeight="bold"
                                        mb={1}
                                        sx={{
                                            color: "#2c3e50",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        Incluye:
                                    </Typography>
                                    {ubicacion.caracteristicas.slice(0, 3).map(
                                        (caracteristica, idx) => (
                                            <Box
                                                key={idx}
                                                display="flex"
                                                alignItems="flex-start"
                                                gap={0.5}
                                                mb={0.5}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 3,
                                                        height: 3,
                                                        borderRadius: "50%",
                                                         backgroundColor: "#3498db",
                                                        flexShrink: 0,
                                                        mt: 0.3,
                                                    }}
                                                />
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: "#5a6c7d",
                                                        fontSize: "0.7rem",
                                                        lineHeight: 1.2,
                                                    }}
                                                >
                                                    {caracteristica}
                                                </Typography>
                                            </Box>
                                        )
                                    )}
                                </Box>

                                {/* Botón de acción */}
                                <Button
                                     variant="outlined"
                                    fullWidth
                                    size="small"
                                    onClick={() => handleContactar(ubicacion)}
                                    sx={{
                                        borderRadius: 1,
                                        py: 0.8,
                                        fontWeight: "bold",
                                        textTransform: "none",
                                        fontSize: "0.8rem",
                                         backgroundColor: "transparent",
                                         color: "#3498db",
                                        borderColor: "#3498db",
                                        borderWidth: 1.5,
                                         "&:hover": {
                                             backgroundColor: "#3498db",
                                            color: "white",
                                            transform: "translateY(-1px)",
                                            boxShadow:
                                                "0 2px 8px rgba(0,0,0,0.1)",
                                        },
                                    }}
                                >
                                    Contratar
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                </Grid>
            )}

            {/* Beneficios adicionales */}
            <Box mt={4} textAlign="center">
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                        color: "#2c3e50",
                        mb: 2,
                        fontSize: { xs: "1.5rem", md: "2rem" },
                    }}
                >
                    Beneficios Adicionales
                </Typography>
                <Typography
                    variant="h6"
                    mb={4}
                    sx={{
                        color: "#5a6c7d",
                        fontSize: { xs: "1rem", md: "1.1rem" },
                    }}
                >
                    Todos nuestros planes incluyen:
                </Typography>

                <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    maxWidth="800px"
                    mx="auto"
                >
                    {beneficios.map((beneficio, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    p: 2,
                                    backgroundColor: "white",
                                    borderRadius: 2,
                                    border: "1px solid #e0e0e0",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                        boxShadow:
                                            "0 4px 15px rgba(0,0,0,0.12)",
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        backgroundColor: "#3498db",
                                        color: "white",
                                        flexShrink: 0,
                                    }}
                                >
                                    <MonetizationOn fontSize="small" />
                                </Box>
                                <Typography
                                    variant="body2"
                                    fontWeight="medium"
                                    sx={{
                                        color: "#2c3e50",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    {beneficio}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>


        </Box>
    );
};

export default PreciosPublicidad;
