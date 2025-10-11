// src/pages/perfil/tabs/PublicacionesTab.jsx

import React, { useEffect, useState } from "react";
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    IconButton,
    Box,
    Container,
    Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthProvider";
import { getPublicacionesUser } from "../../../api/userApi";
import {
    mostrarAlertaExito,
    mostrarAlertaError,
} from "../../../utils/showAlert";
import CustomLoader from "../../../components/CustomLoader";
import ConsultarPublicacion from "../publicaciones/ConsultarPublicacion";
import CambiarEstadoPublicacion from "../../../components/CambiarEstadoPublicacion";
const PublicacionesTab = () => {
    const [posts, setPosts] = useState([]);
    const user = useAuth();
    const [loading, setLoading] = useState(true);
    const [postToViewId, setPostToViewId] = useState(null);
    const navigate = useNavigate();
    const [modalEstadoAbierto, setModalEstadoAbierto] = useState(false);
    const [postSeleccionado, setPostSeleccionado] = useState(null);

    const cargarPublicaciones = async () => {
        try {
            const res = await getPublicacionesUser(user.user.email);
            setPosts(res.data);
        } catch (error) {
            console.error("Error al cargar publicaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPublicaciones();
    }, []);


    const handleEstadoCambiado = () => {
        cargarPublicaciones(); // Recargar la lista
    };

    if (postToViewId !== null) {
        return (
            <ConsultarPublicacion
                id={postToViewId}
                onCancel={() => setPostToViewId(null)}
            />
        );
    }

    if (loading) {
        return (
            <Container sx={{ textAlign: "center", mt: 5 }}>
                <CustomLoader />
            </Container>
        );
    }

    return (
        <>
            <Box mt={2}>
                
                
                <Grid container spacing={2}>
                    {posts.length === 0 && (
                        <Grid item size={{xs:12}}>
                            <Box sx={{ 
                                textAlign: 'center',
                                py: 6,
                                px: 4,
                                backgroundColor: '#f8f9fa',
                                borderRadius: 3,
                                border: '2px dashed #dee2e6'
                            }}>
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        color: '#6c757d',
                                        mb: 1
                                    }}
                                >
                                    🐾 No tenés publicaciones aún
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                >
                                    Cuando publiques mascotas perdidas, encontradas o en adopción, aparecerán aquí
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                    {posts.map((post) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                            <Card sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column',
                                borderRadius: 3,
                                boxShadow: 2,
                                transition: 'all 0.3s ease',
                                opacity: (post.estado === 'Finalizada' || post.estado === 'Cancelada' || post.estadoId === 2 || post.estadoId === 3) ? 0.8 : 1,
                                border: (post.estado === 'Finalizada' || post.estado === 'Cancelada' || post.estadoId === 2 || post.estadoId === 3) ? '2px solid #e0e0e0' : '2px solid transparent',
                                '&:hover': {
                                    boxShadow: 6,
                                    transform: (post.estado === 'Finalizada' || post.estado === 'Cancelada' || post.estadoId === 2 || post.estadoId === 3) ? 'translateY(-2px)' : 'translateY(-4px)',
                                    opacity: 1
                                }
                            }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={
                                        post.fotos[0]?.foto ||
                                        "/placeholder.png"
                                    }
                                    alt={post.nombre || "Mascota"}
                                    sx={{ 
                                        objectFit: "cover",
                                        width: "100%",
                                        backgroundColor: "#f5f5f5",
                                        borderTopLeftRadius: 12,
                                        borderTopRightRadius: 12,
                                        filter: (post.estado === 'Finalizada' || post.estado === 'Cancelada' || post.estadoId === 2 || post.estadoId === 3) ? 'grayscale(50%)' : 'none',
                                        opacity: (post.estado === 'Finalizada' || post.estado === 'Cancelada' || post.estadoId === 2 || post.estadoId === 3) ? 0.7 : 1
                                    }}
                                />
                                <CardContent sx={{ 
                                    flexGrow: 1, 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    justifyContent: 'space-between',
                                    p: 2
                                }}>
                                    {/* Información de la mascota */}
                                    <Box sx={{ mb: 2 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{ 
                                                fontWeight: 'bold',
                                                mb: 0.5,
                                                color: '#2c3e50'
                                            }}
                                        >
                                            {post.nombre || "Sin nombre"}
                                        </Typography>
                                        
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 1.5 }}
                                        >
                                            {post.publicacionTipo}
                                        </Typography>
                                        
                                        {/* Badge de estado */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Box
                                                sx={{
                                                    backgroundColor: (post.estado === 'Finalizada' || post.estadoId === 2) ? '#2196f3' : 
                                                                  (post.estado === 'Cancelada' || post.estadoId === 3) ? '#ff9800' : '#4caf50',
                                                    color: 'white',
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: 2,
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                }}
                                            >
                                                {post.estado || (post.estadoId === 2 ? 'Finalizada' : post.estadoId === 3 ? 'Cancelada' : 'Activa')}
                                            </Box>
                                        </Box>
                                        
                                        {/* Fecha de finalización si aplica */}
                                        {post.fechaFinalizada && (
                                            <Typography 
                                                variant="caption" 
                                                color="text.secondary"
                                                sx={{ 
                                                    display: 'block',
                                                    fontStyle: 'italic'
                                                }}
                                            >
                                                Finalizada: {new Date(post.fechaFinalizada).toLocaleDateString()}
                                            </Typography>
                                        )}
                                    </Box>

                                    {/* Botones de acción */}
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'center',
                                        gap: 0.5,
                                        pt: 1,
                                        borderTop: '1px solid #f0f0f0'
                                    }}>
                                        <Tooltip title={
                                            (post.estado === 'Finalizada' || post.estado === 'Cancelada' || post.estadoId === 2 || post.estadoId === 3) 
                                                ? "No se puede ver detalles de publicaciones finalizadas o canceladas" 
                                                : "Ver detalles"
                                        }>
                                            <span>
                                                <IconButton
                                                    onClick={() => {
                                                        if (!(post.estado === 'Finalizada' || post.estado === 'Cancelada' || post.estadoId === 2 || post.estadoId === 3)) {
                                                            setPostToViewId(post.id);
                                                        }
                                                    }}
                                                    disabled={(post.estado === 'Finalizada' || post.estado === 'Cancelada' || post.estadoId === 2 || post.estadoId === 3)}
                                                    sx={{ 
                                                        color: (post.estado === 'Finalizada' || post.estado === 'Cancelada' || post.estadoId === 2 || post.estadoId === 3) ? '#ccc' : '#2196f3',
                                                        '&:hover': {
                                                            backgroundColor: (post.estado === 'Finalizada' || post.estado === 'Cancelada' || post.estadoId === 2 || post.estadoId === 3) ? 'transparent' : '#e3f2fd',
                                                            transform: (post.estado === 'Finalizada' || post.estado === 'Cancelada' || post.estadoId === 2 || post.estadoId === 3) ? 'none' : 'scale(1.1)'
                                                        },
                                                        transition: 'all 0.2s ease',
                                                        cursor: (post.estado === 'Finalizada' || post.estado === 'Cancelada' || post.estadoId === 2 || post.estadoId === 3) ? 'not-allowed' : 'pointer'
                                                    }}
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                        
                                        {((post.estado === 'Activa' || !post.estado) && post.estadoId !== 2 && post.estadoId !== 3) && (
                                            <Tooltip title="Editar">
                                                <IconButton
                                                    onClick={() => navigate(`/modificar-publicacion/${post.id}`)}
                                                    sx={{ 
                                                        color: '#ff9800',
                                                        '&:hover': {
                                                            backgroundColor: '#fff3e0',
                                                            transform: 'scale(1.1)'
                                                        },
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                        {((post.estado === 'Activa' || !post.estado) && post.estadoId !== 2 && post.estadoId !== 3) && (
                                            <Tooltip title="Finalizar publicación">
                                                <IconButton
                                                    onClick={() => {
                                                        setPostSeleccionado(post);
                                                        setModalEstadoAbierto(true);
                                                    }}
                                                    sx={{ 
                                                        color: '#4caf50',
                                                        '&:hover': {
                                                            backgroundColor: '#e8f5e8',
                                                            transform: 'scale(1.1)'
                                                        },
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <CheckCircleIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                        {((post.estado === 'Finalizada' || post.estado === 'Cancelada') || post.estadoId === 2 || post.estadoId === 3) && (
                                            <Tooltip title="Cambiar estado">
                                                <IconButton
                                                    onClick={() => {
                                                        setPostSeleccionado(post);
                                                        setModalEstadoAbierto(true);
                                                    }}
                                                    sx={{ 
                                                        color: '#2196f3',
                                                        '&:hover': {
                                                            backgroundColor: '#e3f2fd',
                                                            transform: 'scale(1.1)'
                                                        },
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <CheckCircleIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>


            {/* Modal para cambiar estado */}
            <CambiarEstadoPublicacion
                open={modalEstadoAbierto}
                onClose={() => {
                    setModalEstadoAbierto(false);
                    setPostSeleccionado(null);
                }}
                publicacionId={postSeleccionado?.id}
                onEstadoCambiado={handleEstadoCambiado}
                tipoPublicacion={postSeleccionado?.publicacionTipo}
                nombrePublicacionMascota={postSeleccionado?.nombre}
            />
        </>
    );
};

export default PublicacionesTab;
