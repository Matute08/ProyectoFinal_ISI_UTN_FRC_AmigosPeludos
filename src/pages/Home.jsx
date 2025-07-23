import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import React from "react";
import fondoGato from "../assets/landing.jpg"; // Asegurate de tener esta imagen
import Servicios from "../components/Servicios";
import Denuncias from "../components/Denuncias";

const Home = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <>
            <Box
                sx={{
                    backgroundColor: "#F4A261", // tu naranja personalizado
                    minHeight: "90vh",
                    px: 2,
                    py: 2,
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {!isMobile && (
                    <Box
                        component="img"
                        src={fondoGato}
                        alt="persona abrazando un gato"
                        sx={{
                            width: "50%",
                            maxHeight: "90vh",
                            objectFit: "contain",
                            pr: 4,
                        }}
                    />
                )}

                <Box
                    sx={{
                        width: isMobile ? "100%" : "50%",
                        textAlign: isMobile ? "center" : "left",
                        px: isMobile ? 2 : 4,
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ color: "black" }}
                    >
                        En{" "}
                        <Box
                            component="span"
                            sx={{ color: "purple", display: "inline" }}
                        >
                            Amigos Peludos
                        </Box>
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        te ayudamos a encontrar a tu mascota
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Nuestra misión es ayudarte a encontrar el compañero
                        peludo perfecto para ti. Ya sea que estés buscando
                        adoptar o necesites servicios para tu mascota actual,{" "}
                        <strong>¡estamos aquí para ayudarte!</strong> Además, si
                        te apasionan los animales y querés ser parte de nuestro
                        equipo,{" "}
                        <strong>
                            ¡sumate y hacé una diferencia en la vida de los
                            animales!
                        </strong>
                    </Typography>
                </Box>
            </Box>

            <Servicios />
        </>
    );
};

export default Home;
