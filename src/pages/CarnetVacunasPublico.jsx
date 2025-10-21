import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Typography,
    Container,
    CircularProgress,
    Alert,
    Paper,
    Stack,
    Card,
    CardContent,
    Avatar,
    Chip,
    Grid,
    Divider,
    IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import PetsIcon from "@mui/icons-material/Pets";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { getMascotaId } from "../api/mascotasApi";
import { getVacunasMascota } from "../api/vacunaApi";
import CarnetDigitalMascota from "./perfil/mascotas/vacunas/CarnetDigitalMascota";
import CustomLoader from "../components/CustomLoader";

const CarnetVacunasPublico = () => {
    const { mascotaId } = useParams();
    const navigate = useNavigate();
    const [mascota, setMascota] = useState(null);
    const [vacunas, setVacunas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCarnet, setShowCarnet] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const id = parseInt(mascotaId, 10);
                if (isNaN(id)) {
                    throw new Error("ID de mascota inválido");
                }

                // Cargar datos de la mascota y vacunas en paralelo
                const [mascotaRes, vacunasRes] = await Promise.all([
                    getMascotaId(id),
                    getVacunasMascota(id)
                ]);

                setMascota(mascotaRes.data);
                setVacunas(vacunasRes.data);
            } catch (err) {
                console.error("Error cargando datos:", err);
                setError("No se pudo cargar el carnet de vacunación. Verificá que el enlace sea correcto.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [mascotaId]);

    const handleVerCarnet = () => {
        setShowCarnet(true);
    };

    const handleCerrarCarnet = () => {
        setShowCarnet(false);
    };

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
                <CustomLoader text="Cargando carnet de vacunación..." />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                    <Button
                        variant="contained"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate("/")}
                        sx={{
                            backgroundColor: "#F4A261",
                            "&:hover": { backgroundColor: "#E76F51" },
                        }}
                    >
                        Volver al inicio
                    </Button>
                </Paper>
            </Container>
        );
    }

    if (!mascota) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        No se encontró la mascota solicitada.
                    </Alert>
                    <Button
                        variant="contained"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate("/")}
                        sx={{
                            backgroundColor: "#F4A261",
                            "&:hover": { backgroundColor: "#E76F51" },
                        }}
                    >
                        Volver al inicio
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Box sx={{ 
            minHeight: "100vh", 
            py: 4
        }}>
            <Container maxWidth="lg">
                {/* Header con diseño mejorado */}
                <Card 
                    elevation={8} 
                    sx={{ 
                        mb: 4, 
                        borderRadius: 4,
                        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                        border: "1px solid rgba(244, 162, 97, 0.2)"
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ textAlign: "center", mb: 4 }}>
                            <Box sx={{ 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                gap: 2, 
                                mb: 3 
                            }}>
                                <VaccinesIcon sx={{ 
                                    fontSize: "3rem", 
                                    color: "#F4A261" 
                                }} />
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: "bold",
                                        color: "#333",
                                        textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
                                    }}
                                >
                                    Carnet de Vacunación Digital
                                </Typography>
                            </Box>
                            
                            <Typography
                                variant="h4"
                                sx={{
                                    color: "#333",
                                    mb: 2,
                                    fontWeight: 600,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 1
                                }}
                            >
                                <PetsIcon sx={{ fontSize: "2.5rem", color: "#E76F51" }} />
                                {mascota.nombre}
                            </Typography>

                           
                        </Box>

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<VaccinesIcon />}
                                onClick={handleVerCarnet}
                                sx={{
                                    backgroundColor: "#F4A261",
                                    color: "white",
                                    "&:hover": { 
                                        backgroundColor: "#E76F51",
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 8px 25px rgba(244, 162, 97, 0.4)"
                                    },
                                    fontWeight: "bold",
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 3,
                                    fontSize: "1.1rem",
                                    transition: "all 0.3s ease"
                                }}
                            >
                                Ver Carnet Completo
                            </Button>
                            
                            <Button
                                variant="outlined"
                                size="large"
                                startIcon={<HomeIcon />}
                                onClick={() => navigate("/")}
                                sx={{
                                    borderColor: "#F4A261",
                                    color: "#F4A261",
                                    borderWidth: 2,
                                    "&:hover": {
                                        backgroundColor: "#F4A261",
                                        color: "white",
                                        borderColor: "#F4A261",
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 8px 25px rgba(244, 162, 97, 0.4)"
                                    },
                                    fontWeight: "bold",
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 3,
                                    fontSize: "1.1rem",
                                    transition: "all 0.3s ease"
                                }}
                            >
                                Volver al inicio
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Información de la mascota con diseño de tarjetas */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card 
                            elevation={4} 
                            sx={{ 
                                height: "100%",
                                borderRadius: 3,
                                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                                border: "1px solid rgba(244, 162, 97, 0.1)"
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: 1, 
                                    mb: 3 
                                }}>
                                    <PetsIcon sx={{ color: "#F4A261", fontSize: "1.5rem" }} />
                                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                                        Información de la Mascota
                                    </Typography>
                                </Box>
                                
                                <Stack spacing={2}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Typography variant="body1" sx={{ fontWeight: "bold", minWidth: "80px" }}>
                                            Nombre:
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: "#666" }}>
                                            {mascota.nombre}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Typography variant="body1" sx={{ fontWeight: "bold", minWidth: "80px" }}>
                                            Especie:
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: "#666" }}>
                                            {mascota.tipoMascotaNombre || "-"}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Typography variant="body1" sx={{ fontWeight: "bold", minWidth: "80px" }}>
                                            Sexo:
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: "#666" }}>
                                            {mascota.sexoMascota || "-"}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Typography variant="body1" sx={{ fontWeight: "bold", minWidth: "80px" }}>
                                            Color:
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: "#666" }}>
                                            {mascota.color || "-"}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card 
                            elevation={4} 
                            sx={{ 
                                height: "100%",
                                borderRadius: 3,
                                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                                border: "1px solid rgba(244, 162, 97, 0.1)"
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: 1, 
                                    mb: 3 
                                }}>
                                    <PersonIcon sx={{ color: "#F4A261", fontSize: "1.5rem" }} />
                                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                                        Información del Dueño
                                    </Typography>
                                </Box>
                                
                                <Stack spacing={2}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Typography variant="body1" sx={{ fontWeight: "bold", minWidth: "80px" }}>
                                            Nombre:
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: "#666" }}>
                                            {mascota.usuario?.nombreCompleto || "-"}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Typography variant="body1" sx={{ fontWeight: "bold", minWidth: "80px" }}>
                                            Teléfono:
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: "#666" }}>
                                            {mascota.usuario?.celular || "-"}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Typography variant="body1" sx={{ fontWeight: "bold", minWidth: "80px" }}>
                                            Email:
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: "#666" }}>
                                            {mascota.usuario?.mail || "-"}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Typography variant="body1" sx={{ fontWeight: "bold", minWidth: "80px" }}>
                                            Dirección:
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: "#666" }}>
                                            {mascota.usuario?.calle || "-"}{" "}
                                            {mascota.usuario?.nroCalle || ""}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Resumen de vacunas con diseño mejorado */}
                {vacunas.length > 0 ? (
                    <Card 
                        elevation={4} 
                        sx={{ 
                            borderRadius: 3,
                            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                            border: "1px solid rgba(244, 162, 97, 0.1)"
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ 
                                display: "flex", 
                                alignItems: "center", 
                                gap: 1, 
                                mb: 3 
                            }}>
                                <CalendarTodayIcon sx={{ color: "#F4A261", fontSize: "1.5rem" }} />
                                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                                    Resumen de Vacunación
                                </Typography>
                            </Box>
                            
                            <Box sx={{ 
                                p: 3, 
                                backgroundColor: "rgba(244, 162, 97, 0.1)", 
                                borderRadius: 2,
                                border: "1px solid rgba(244, 162, 97, 0.2)"
                            }}>
                                <Typography variant="body1" sx={{ mb: 2, fontSize: "1.1rem" }}>
                                    🐾 <strong>{mascota.nombre}</strong> tiene <strong>{vacunas.length} dosis de vacunas</strong> registradas en el sistema.
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
                                    Hacé clic en "Ver Carnet Completo" para acceder al carnet digital interactivo 
                                    con todos los detalles de las vacunas aplicadas.
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                    color: "#F4A261", 
                                    fontWeight: "bold",
                                    fontStyle: "italic"
                                }}>
                                    Este carnet es oficial y ha sido generado por Amigos Peludos.
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ) : (
                    <Card 
                        elevation={4} 
                        sx={{ 
                            borderRadius: 3,
                            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                            border: "1px solid rgba(244, 162, 97, 0.1)"
                        }}
                    >
                        <CardContent sx={{ p: 4, textAlign: "center" }}>
                            <VaccinesIcon sx={{ fontSize: "4rem", color: "#ccc", mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No hay vacunas registradas
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Esta mascota aún no tiene vacunas registradas en el sistema.
                            </Typography>
                        </CardContent>
                    </Card>
                )}

                {/* Modal del carnet */}
                <CarnetDigitalMascota
                    open={showCarnet}
                    onClose={handleCerrarCarnet}
                    vacunas={vacunas}
                    mascota={mascota}
                    showShareButtons={false}
                />
            </Container>
        </Box>
    );
};

export default CarnetVacunasPublico;
