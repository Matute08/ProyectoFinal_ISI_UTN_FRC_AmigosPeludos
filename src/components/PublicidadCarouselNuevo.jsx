import React, { useState, useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    IconButton,
    Chip,
    useTheme,
    useMediaQuery,
    Container,
} from "@mui/material";
import {
    ChevronLeft,
    ChevronRight,
    OpenInNew,
    Star,
    TrendingUp,
} from "@mui/icons-material";
import { getPublicidadesPorUbicacion, registrarVisualizacionPublicidad, registrarClicPublicidad } from "../api/publicidadesApi";

const PublicidadCarouselNuevo = ({ ubicacion = "home", onClicPublicidad }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));

    const [currentIndex, setCurrentIndex] = useState(0);
    const [publicidades, setPublicidades] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mapear ubicación a ubicacionId
    const getUbicacionId = (ubicacion) => {
        switch (ubicacion) {
            case "home":
                return 1;
            case "perdidos":
            case "encontrados":
            case "adopcion":
                return 2;
            default:
                return 1; // Default a home
        }
    };

    // Obtener publicidades según la ubicación desde la API
    useEffect(() => {
        const cargarPublicidades = async () => {
            try {
                setLoading(true);
                const ubicacionId = getUbicacionId(ubicacion);
                
                const publicidadesData = await getPublicidadesPorUbicacion(ubicacionId);
                
                // Asegurar que los datos tengan la estructura correcta
                const publicidadesFormateadas = Array.isArray(publicidadesData) 
                    ? publicidadesData.map(pub => ({
                        id: pub.id,
                        titulo: pub.titulo || 'Sin título',
                        descripcion: pub.descripcion || 'Sin descripción',
                        imagen: pub.imagen || '/placeholder.png',
                        url: pub.url || null,
                        tipoAnunciante: typeof pub.tipoAnunciante === 'object' ? pub.tipoAnunciante?.nombre || 'Servicio' : pub.tipoAnunciante || 'Servicio',
                        promocion: pub.promocion || null,
                        ubicacion: pub.ubicacion || ubicacion
                    }))
                    : [];
                
                setPublicidades(publicidadesFormateadas);
                
                // Registrar visualizaciones para cada publicidad cargada
                publicidadesFormateadas.forEach(async (publicidad) => {
                    try {
                        await registrarVisualizacionPublicidad(publicidad.id);
                    } catch (error) {
                        console.error(`Error al registrar visualización para publicidad ${publicidad.id}:`, error);
                    }
                });
                
            } catch (error) {
                console.error('Error al cargar publicidades:', error);
                setPublicidades([]);
            } finally {
                setLoading(false);
            }
        };

        cargarPublicidades();
    }, [ubicacion]);

    // Calcular cuántas publicidades mostrar según el tamaño de pantalla
    const getVisibleCount = () => {
        if (isMobile) return 1;
        if (isTablet) return 2;
        return 3; // 3 cards en pantallas grandes para evitar cortes
    };

    const visibleCount = getVisibleCount();

    // Auto-rotación cada 5 segundos
    useEffect(() => {
        if (publicidades.length <= visibleCount) return;

        const interval = setInterval(() => {
            setCurrentIndex(
                (prevIndex) => (prevIndex + 1) % publicidades.length
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [publicidades.length, visibleCount]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % publicidades.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? publicidades.length - 1 : prevIndex - 1
        );
    };

    // Función para normalizar URLs
    const normalizarUrl = (url) => {
        if (!url) return null;
        
        // Si ya tiene protocolo, devolverla tal como está
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        
        // Si empieza con www., agregar https://
        if (url.startsWith('www.')) {
            return `https://${url}`;
        }
        
        // Para cualquier otra URL, agregar https://
        return `https://${url}`;
    };

    const handleClic = async (publicidad) => {
        if (publicidad.url) {
            try {
                // Registrar el clic antes de abrir la URL
                await registrarClicPublicidad(publicidad.id);
                
                // Llamar a la función adicional si se proporciona
                if (onClicPublicidad) {
                    await onClicPublicidad(publicidad.id);
                }
                
                // Normalizar y abrir la URL
                const urlNormalizada = normalizarUrl(publicidad.url);
                window.open(urlNormalizada, "_blank");
            } catch (error) {
                console.error(`Error al registrar clic para publicidad ${publicidad.id}:`, error);
                // Aún abrir la URL aunque falle el registro del clic
                const urlNormalizada = normalizarUrl(publicidad.url);
                window.open(urlNormalizada, "_blank");
            }
        }
    };

    if (loading) {
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
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "200px",
                }}
            >
                <Typography variant="h6" color="text.secondary">
                    Cargando publicidades...
                </Typography>
            </Box>
        );
    }

    if (publicidades.length === 0) {
        return null;
    }

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
                position: "relative",
            }}
        >
            {/* Chip AD */}
            <Chip
                label="AD"
                sx={{
                    position: "absolute",
                    top: { xs: 12, sm: 16 },
                    right: { xs: 12, sm: 16 },
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                    height: 24,
                    zIndex: 10,
                }}
            />

            {/* Contenedor del carrusel */}
            <Box sx={{ position: "relative", width: "100%", height: "fit-content" }}>
                {/* Contenedor principal del carrusel */}
                <Box
                    sx={{
                        overflow: "hidden",
                        width: "100%",
                        borderRadius: 2,
                    }}
                >
                    {/* Contenedor de las cards */}
                    <Box
                        sx={{
                            display: "flex",
                            transition: "transform 0.5s ease-in-out",
                            transform: `translateX(calc(-${currentIndex * (100 / visibleCount)}% - ${currentIndex * 16}px))`,
                            gap: 2,
                            m: 2,
                        }}
                    >
                        {publicidades.map((publicidad, index) => (
                            <Box
                                key={publicidad.id}
                                sx={{
                                    width: `calc(${100 / visibleCount}% - ${(16 * (visibleCount - 1)) / visibleCount}px)`,
                                    flexShrink: 0,
                                    px: 0.5,
                                    minWidth: isMobile ? "280px" : isTablet ? "300px" : "320px",
                                }}
                            >
                                <Card
                                    sx={{
                                        cursor: publicidad.url ? "pointer" : "default",
                                        height: "100%",
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        transition: "all 0.3s ease",
                                        boxShadow: theme.shadows[3],
                                        "&:hover": publicidad.url
                                            ? {
                                                  transform: "translateY(-4px)",
                                                  boxShadow: theme.shadows[8],
                                              }
                                            : {},
                                    }}
                                    onClick={() =>
                                        publicidad.url && handleClic(publicidad)
                                    }
                                >
                                    {/* Imagen */}
                                    <Box sx={{ position: "relative", height: 200 }}>
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={publicidad.imagen || "/placeholder.png"}
                                            alt={publicidad.titulo}
                                            sx={{
                                                objectFit: "cover",
                                                width: "100%",
                                            }}
                                        />
                                        {/* Badge de tipo */}
                                        <Chip
                                            label={typeof publicidad.tipoAnunciante === 'object' ? publicidad.tipoAnunciante?.nombre : publicidad.tipoAnunciante}
                                            size="small"
                                            sx={{
                                                position: "absolute",
                                                top: 12,
                                                left: 12,
                                                backgroundColor: theme.palette.primary.main,
                                                color: "white",
                                                fontSize: "0.75rem",
                                                fontWeight: "bold",
                                            }}
                                        />
                                        {/* Badge de promoción */}
                                        {publicidad.promocion && (
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: 12,
                                                    right: 12,
                                                    backgroundColor: theme.palette.error.main,
                                                    color: "white",
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    fontSize: "0.75rem",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {publicidad.promocion}
                                            </Box>
                                        )}
                                        {/* Estrella destacada */}
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                bottom: 12,
                                                right: 12,
                                                backgroundColor: theme.palette.warning.main,
                                                borderRadius: "50%",
                                                width: 32,
                                                height: 32,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Star sx={{ fontSize: 18, color: "white" }} />
                                        </Box>
                                    </Box>

                                    {/* Contenido */}
                                    <CardContent sx={{ p: 2 }}>
                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                            color="primary"
                                            gutterBottom
                                            sx={{
                                                fontSize: "1rem",
                                                lineHeight: 1.3,
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                mb: 1,
                                            }}
                                        >
                                            {publicidad.titulo}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                fontSize: "0.85rem",
                                                lineHeight: 1.4,
                                                display: "-webkit-box",
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                mb: 2,
                                            }}
                                        >
                                            {publicidad.descripcion}
                                        </Typography>

                                        {publicidad.url && (
                                            <Button
                                                variant="contained"
                                                endIcon={<OpenInNew />}
                                                size="small"
                                                sx={{
                                                    textTransform: "none",
                                                    borderRadius: 1,
                                                    fontSize: "0.8rem",
                                                }}
                                            >
                                                Ver más
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Botones de navegación */}
                {publicidades.length > visibleCount && (
                    <>
                        <IconButton
                            onClick={handlePrev}
                            sx={{
                                position: "absolute",
                                left: -20,
                                top: "50%",
                                transform: "translateY(-50%)",
                                backgroundColor: theme.palette.primary.main,
                                color: "white",
                                width: 40,
                                height: 40,
                                "&:hover": {
                                    backgroundColor: theme.palette.primary.dark,
                                },
                                zIndex: 2,
                            }}
                        >
                            <ChevronLeft />
                        </IconButton>

                        <IconButton
                            onClick={handleNext}
                            sx={{
                                position: "absolute",
                                right: -20,
                                top: "50%",
                                transform: "translateY(-50%)",
                                backgroundColor: theme.palette.primary.main,
                                color: "white",
                                width: 40,
                                height: 40,
                                "&:hover": {
                                    backgroundColor: theme.palette.primary.dark,
                                },
                                zIndex: 2,
                            }}
                        >
                            <ChevronRight />
                        </IconButton>
                    </>
                )}

                {/* Indicadores de puntos */}
                {publicidades.length > visibleCount && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                            mt: 2,
                            mb: 1,
                        }}
                    >
                        {Array.from({ length: Math.ceil(publicidades.length / visibleCount) }).map((_, index) => (
                            <Box
                                key={index}
                                onClick={() => setCurrentIndex(index * visibleCount)}
                                sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    backgroundColor:
                                        Math.floor(currentIndex / visibleCount) === index
                                            ? theme.palette.primary.main
                                            : theme.palette.grey[400],
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        backgroundColor: theme.palette.primary.main,
                                        transform: "scale(1.2)",
                                    },
                                }}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default PublicidadCarouselNuevo;
