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

    const [publicidades, setPublicidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const carouselRef = React.useRef(null);

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

    // Crear array duplicado para el carrusel infinito fluido
    // Duplicamos TODO el contenido al final para crear un loop infinito perfecto
    const publicidadesInfinitas = React.useMemo(() => {
        if (publicidades.length === 0) return [];
        // Duplicar todo el contenido al final
        return [...publicidades, ...publicidades];
    }, [publicidades]);

    // Índice actual del carrusel
    const [currentIndex, setCurrentIndex] = useState(0);

    // Efecto para detectar cuando llegamos al final y resetear (después de la transición)
    useEffect(() => {
        if (publicidades.length === 0) return;
        
        // Si el índice llegó al final del contenido original
        if (currentIndex >= publicidades.length) {
            // Esperar que termine la transición (600ms) y luego resetear sin transición
            const timer = setTimeout(() => {
                if (carouselRef.current) {
                    carouselRef.current.style.transition = 'none';
                    setCurrentIndex(0);
                    // Forzar reflow
                    void carouselRef.current.offsetHeight;
                    // Reactivar transición en el siguiente frame
                    setTimeout(() => {
                        if (carouselRef.current) {
                            carouselRef.current.style.transition = 'transform 0.6s ease-in-out';
                        }
                    }, 50);
                }
            }, 600); // Tiempo de la transición CSS
            
            return () => clearTimeout(timer);
        }
        
        // Si retrocedimos antes del inicio
        if (currentIndex < 0) {
            const timer = setTimeout(() => {
                if (carouselRef.current) {
                    carouselRef.current.style.transition = 'none';
                    setCurrentIndex(publicidades.length - 1);
                    void carouselRef.current.offsetHeight;
                    setTimeout(() => {
                        if (carouselRef.current) {
                            carouselRef.current.style.transition = 'transform 0.6s ease-in-out';
                        }
                    }, 50);
                }
            }, 600);
            
            return () => clearTimeout(timer);
        }
    }, [currentIndex, publicidades.length]);

    // Auto-rotación continua (solo si no está en pausa)
    useEffect(() => {
        if (publicidades.length <= visibleCount || isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }, 2000);

        return () => clearInterval(interval);
    }, [publicidades.length, visibleCount, isPaused]);

    // Función para avanzar al siguiente item
    const handleNext = () => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
    };

    // Función para retroceder al item anterior
    const handlePrev = () => {
        setCurrentIndex((prevIndex) => {
            if (prevIndex === 0) {
                // Si estamos al inicio, ir al final (el useEffect manejará el salto invisible)
                return publicidades.length;
            }
            return prevIndex - 1;
        });
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
        try {
            // Registrar el clic
            await registrarClicPublicidad(publicidad.id);
            
            // Llamar a la función adicional si se proporciona
            if (onClicPublicidad) {
                await onClicPublicidad(publicidad.id);
            }
            
            // Si hay URL, abrirla
            if (publicidad.url) {
                const urlNormalizada = normalizarUrl(publicidad.url);
                window.open(urlNormalizada, "_blank");
            }
        } catch (error) {
            console.error(`Error al registrar clic para publicidad ${publicidad.id}:`, error);
            // Si hay URL, intentar abrirla aunque falle el registro del clic
            if (publicidad.url) {
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
            <Box 
                sx={{ position: "relative", width: "100%", height: "fit-content" }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
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
                        ref={carouselRef}
                        sx={{
                            display: "flex",
                            transition: "transform 0.6s ease-in-out",
                            // Calcular el desplazamiento: ancho de card + gap por cada índice
                            // gap: 2 = 16px en Material-UI
                            // Si estamos en las copias (>= maxIndex), usar el índice normalizado
                            transform: `translateX(calc(-${currentIndex * (100 / visibleCount)}% - ${currentIndex * 16}px))`,
                            gap: 2,
                            m: 2,
                            willChange: "transform",
                        }}
                    >
                        {publicidadesInfinitas.map((publicidad, index) => (
                                <Box
                                key={`${publicidad.id}-${index}`}
                                sx={{
                                    width: `calc(${100 / visibleCount}% - ${(16 * (visibleCount - 1)) / visibleCount}px)`,
                                    flexShrink: 0,
                                    px: 0.5,
                                    minWidth: isMobile ? "280px" : isTablet ? "300px" : "320px",
                                }}
                            >
                                <Card
                                    sx={{
                                        cursor: "pointer",
                                        height: "100%",
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        transition: "all 0.3s ease",
                                        boxShadow: theme.shadows[3],
                                        display: "flex",
                                        flexDirection: "column",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: theme.shadows[8],
                                        },
                                    }}
                                    onClick={() => handleClic(publicidad)}
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
                                    <CardContent 
                                        sx={{ 
                                            p: 2,
                                            flex: 1,
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between"
                                        }}
                                    >
                                        <Box>
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
                                        </Box>

                                        <Box sx={{ mt: "auto", pt: 1, width: "100%" }}>
                                            <Button
                                                variant="contained"
                                                endIcon={publicidad.url ? <OpenInNew /> : null}
                                                size="small"
                                                fullWidth
                                                sx={{
                                                    textTransform: "none",
                                                    borderRadius: 1,
                                                    fontSize: "0.8rem",
                                                    backgroundColor: theme.palette.primary.main,
                                                    "&:hover": {
                                                        backgroundColor: theme.palette.primary.dark,
                                                    },
                                                }}
                                            >
                                                Ver más
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Botones de navegación */}
                {publicidades.length > visibleCount && publicidadesInfinitas.length > visibleCount && (
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

                {/* Sin indicadores de puntos para carrusel infinito continuo */}
            </Box>
        </Box>
    );
};

export default PublicidadCarouselNuevo;
