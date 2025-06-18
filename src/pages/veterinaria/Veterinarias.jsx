import React, { useState, useEffect } from "react";
import { Box, Typography, Container } from "@mui/material";
import Maps from "../../components/Maps";
import PanelDetalleVeterinaria from "./PanelDetalleVeterinaria";
import { getVeterinarias } from "../../api/commonApi";
import FloatingActionButton from "../../components/FloatingActionButton";

const Veterinarias = () => {
    const [registeredVets, setRegisteredVets] = useState([]);
    const [selectedVeterinaria, setSelectedVeterinaria] = useState(null);

    useEffect(() => {
        const fetchVeterinarias = async () => {
            const response = await getVeterinarias();
            const vetsActivas =
                response.data?.filter(
                    (vet) =>
                        vet.estadoId === 2 &&
                        vet.latitud &&
                        vet.longitud &&
                        !isNaN(parseFloat(vet.latitud)) &&
                        !isNaN(parseFloat(vet.longitud))
                ) || [];
            setRegisteredVets(vetsActivas);
        };
        fetchVeterinarias();
    }, []);

    return (
        <>
        <Container sx={{ mt: 4, backgroundColor:"#e0d0b8", borderRadius: 4  }}>

            <Box
                sx={{
                    maxWidth: "1600px",
                    mx: "auto",
                    mt: 4,
                    mb: 6,
                }}
            >
                {/* Título y descripción */}
                <Typography
                    variant="h3"
                    align="center"
                    sx={{ mb: 1, fontWeight: "600" }}
                >
                    Veterinarias Asociadas
                </Typography>
                <Typography
                    align="center"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    Encontrá las veterinarias asociadas a Amigos Peludos. Todas ellas ofrecen atención a animales callejeros y
                    casos de emergencia, y podés ayudarlas donando directamente.
                    Hacé click en el mapa para ver información, horarios,
                    servicios y más.
                </Typography>

                {/* Contenedor Mapa + Panel */}
                <Box
                    sx={{
                        width: "100%",
                        minHeight: "80vh",
                        height: { xs: "80vh", md: "80vh" },
                        position: "relative",
                        borderRadius: 3,
                        overflow: "hidden",
                        boxShadow: 3,
                        background: "#eee",
                    }}
                >
                    {/* Mapa de fondo */}
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            zIndex: 1,
                        }}
                    >
                        <Maps
                            markers={registeredVets.map((v) => ({
                                ...v,
                                label: v.nombre,
                                info: `${v.direccion} ${v.numeroCalle}`,
                            }))}
                            onMarkerClick={setSelectedVeterinaria}
                            center={
                                registeredVets.length
                                    ? [
                                          registeredVets[0].latitud,
                                          registeredVets[0].longitud,
                                      ]
                                    : [-31.4167, -64.1833]
                            }
                            zoom={13}
                        />
                    </Box>
                    {/* Panel sobre el mapa */}
                    <PanelDetalleVeterinaria
                        veterinaria={selectedVeterinaria}
                        onClose={() => setSelectedVeterinaria(null)}
                        open={!!selectedVeterinaria}
                    />
                </Box>
            </Box>
        </Container>

        <FloatingActionButton destino="/agregar-veterinaria" tooltip="Agregar Veterinaria" />

        </>
    );
};

export default Veterinarias;
