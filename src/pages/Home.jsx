import {
    Box,
    Typography,
    useTheme,
    useMediaQuery,
    Button,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import fondoImagen from "../assets/fondo.png";
import Servicios from "../components/Servicios";
import EstadisticasLanding from "../components/EstadisticasLanding";
import PetsIcon from "@mui/icons-material/Pets";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Home = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <>
            <Box
                sx={{
                    height: "calc(100vh - 64px)", // Restar solo la altura del navbar
                    backgroundImage: `url(${fondoImagen})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                            "linear-gradient(180deg, #F4A261 0%, rgba(244, 162, 97, 0.6) 15%, rgba(244, 162, 97, 0.5) 50%, rgba(244, 162, 97, 0.55) 100%)",
                        zIndex: 1,
                    },
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        zIndex: 2,
                        textAlign: "center",
                        px: isMobile ? 2 : 6,
                        py: isMobile ? 3 : 5,
                        maxWidth: "900px",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        minHeight: isMobile ? "auto" : "70vh",
                        
                    }}
                >
                    <Typography
                        variant={isMobile ? "h4" : "h2"}
                        fontWeight="bold"
                        sx={{
                            color: "white",
                            mb: isMobile ? 1.5 : 2,
                            textShadow: "3px 3px 8px rgba(0,0,0,0.8), 1px 1px 3px rgba(0,0,0,0.9)",
                            fontSize: isMobile ? "2rem" : "3.5rem",
                        }}
                    >
                        Tu mejor amigo
                       
                        te está esperando
                    </Typography>

                    

                    <Typography
                        variant={isMobile ? "body1" : "h6"}
                        sx={{
                            color: "white",
                            mb: isMobile ? 3 : 4,
                            lineHeight: 1.6,
                            textShadow: "2px 2px 6px rgba(0,0,0,0.8), 1px 1px 3px rgba(0,0,0,0.9)",
                            fontSize: isMobile ? "1rem" : "1.25rem",
                            fontWeight: 500,
                        }}
                    >
                        Encontrá todo lo que necesitás para tu mascota en un solo lugar.{" "}
                        <Box component="span" sx={{ fontWeight: "bold" }}>
                            Adopciones, servicios especializados y una comunidad que ama a los animales.
                        </Box>
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            justifyContent: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <Button
                            variant="contained"
                            size={isMobile ? "medium" : "large"}
                            onClick={() => navigate("/adopcion")}
                            sx={{
                                background:
                                    "linear-gradient(45deg, #FF6B6B, #FF8E8E)",
                                color: "white",
                                px: isMobile ? 3 : 4,
                                py: isMobile ? 1.2 : 1.5,
                                borderRadius: "50px",
                                fontWeight: "bold",
                                fontSize: isMobile ? "1rem" : "1.1rem",
                                textTransform: "none",
                                boxShadow:
                                    "0 8px 25px rgba(255, 107, 107, 0.4)",
                                minWidth: isMobile ? "140px" : "180px",
                                "&:hover": {
                                    background:
                                        "linear-gradient(45deg, #FF5252, #FF6B6B)",
                                    transform: "translateY(-2px)",
                                    boxShadow:
                                        "0 12px 35px rgba(255, 107, 107, 0.5)",
                                },
                                transition: "all 0.3s ease",
                            }}
                            startIcon={<FavoriteIcon />}
                        >
                            Adoptar Ahora
                        </Button>

                        <Button
                            variant="outlined"
                            size={isMobile ? "medium" : "large"}
                            onClick={() => navigate("/perdidos")}
                            sx={{
                                borderColor: "white",
                                color: "white",
                                px: isMobile ? 3 : 4,
                                py: isMobile ? 1.2 : 1.5,
                                borderRadius: "50px",
                                fontWeight: "bold",
                                fontSize: isMobile ? "1rem" : "1.1rem",
                                textTransform: "none",
                                borderWidth: "2px",
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                minWidth: isMobile ? "140px" : "180px",
                                "&:hover": {
                                    backgroundColor: "white",
                                    color: "#2C3E50",
                                    transform: "translateY(-2px)",
                                    boxShadow:
                                        "0 8px 25px rgba(255, 255, 255, 0.3)",
                                },
                                transition: "all 0.3s ease",
                            }}
                            startIcon={<PetsIcon />}
                        >
                            Buscar Mascota
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Sección de Estadísticas */}
            <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
                <EstadisticasLanding />
            </Box>

            <Servicios />
        </>
    );
};

export default Home;
