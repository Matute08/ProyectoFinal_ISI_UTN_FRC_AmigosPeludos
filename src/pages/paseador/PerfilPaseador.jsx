import React, { useEffect, useState } from "react";
import {
    Avatar,
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getPaseadorPorId } from "../../api/paseadoresApi";
import CustomLoader from "../../components/CustomLoader";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Valoraciones from "../../components/valoraciones";

const PerfilPaseador = () => {
    const { id } = useParams();
    const [paseador, setPaseador] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getPaseadorPorId(id);
                setPaseador(res.data);
            } catch (error) {
                console.error("Error al cargar paseador:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const openWhatsApp = () => {
        const telefono = paseador?.datosUsuario?.celular;
        const mensaje = "¡Hola! Necesito tu servicio de paseador!";
        window.open(
            `https://wa.me/+54${telefono}?text=${encodeURIComponent(mensaje)}`,
            "_blank"
        );
    };

    if (loading) return <CustomLoader />;
    if (!paseador) return <Typography>Error cargando datos.</Typography>;

    return (
        <Container sx={{ mt: 4, borderRadius: 4, pb: 4, minHeight: "auto" }}>
            <Grid container spacing={3}>
                <Grid item size={{ xs: 12, md: 4 }}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            mb={2}
                        >
                            <Avatar
                                src={paseador.datosUsuario?.foto}
                                alt={paseador.datosUsuario?.nombreCompleto}
                                sx={{ width: 100, height: 100, mb: 1 }}
                            />
                            <Typography variant="h6">
                                {paseador.datosUsuario?.nombreCompleto ||
                                    "Nombre no disponible"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Paseador
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                Correo Electrónico
                            </Typography>
                            <Typography variant="body1" mb={1}>
                                {paseador.datosUsuario?.mail}
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                Teléfono
                            </Typography>
                            <Typography variant="body1" mb={1}>
                                {paseador.datosUsuario?.celular}
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                Género
                            </Typography>
                            <Typography variant="body1" mb={1}>
                                {paseador.datosUsuario?.generoUsuario}
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                Dirección
                            </Typography>
                            <Typography variant="body1">
                                {paseador.datosUsuario?.calle}{" "}
                                {paseador.datosUsuario?.nroCalle},{" "}
                                {paseador.datosUsuario?.barrioUsuario},{" "}
                                {paseador.datosUsuario?.ciudadUsuario}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item size={{ xs: 12, md: 8 }}>
                    <Tabs
                        value={tabIndex}
                        onChange={(e, newVal) => setTabIndex(newVal)}
                        indicatorColor="primary"
                        textColor="primary"
                        sx={{ borderBottom: 1, borderColor: "divider" }}
                    >
                        <Tab label="Datos Paseador" />
                        <Tab label="Imágenes" />
                        <Tab label="Horarios" />
                        <Tab label="Valoraciones" /> 
                    </Tabs>

                    {tabIndex === 0 && (
                        <Box mt={3}>
                            <Typography
                                variant="h5"
                                fontWeight={700}
                                color="primary.main"
                                mb={2}
                            >
                                {paseador.titulo}
                            </Typography>
                            <Typography variant="body1" mb={2}>
                                <strong>Descripción:</strong>{" "}
                                {paseador.presentacion}
                            </Typography>
                            <Typography variant="body1" mb={2}>
                                <strong>Zona de trabajo:</strong>{" "}
                                {paseador.barrioTrabajo}
                            </Typography>
                            <Typography variant="body1" mb={2}>
                                <strong>Precio por paseo:</strong> $
                                {paseador.precioPaseo}
                            </Typography>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={openWhatsApp}
                            >
                                Contactar por WhatsApp
                            </Button>
                        </Box>
                    )}

                    {tabIndex === 1 && (
                        <Box mt={3}>
                            {paseador.fotos?.length > 0 ? (
                                <Carousel
                                    showThumbs={false}
                                    autoPlay
                                    infiniteLoop
                                >
                                    {paseador.fotos.map((foto) => (
                                        <div key={foto.id}>
                                            <img
                                                src={foto.foto}
                                                alt="Imagen Paseador"
                                                style={{
                                                    borderRadius: 8,
                                                    maxHeight: 350,
                                                    objectFit: "contain",
                                                }}
                                            />
                                        </div>
                                    ))}
                                </Carousel>
                            ) : (
                                <Typography>
                                    No hay imágenes disponibles.
                                </Typography>
                            )}
                        </Box>
                    )}

                    {tabIndex === 2 && (
                        <Box mt={3}>
                            <Typography variant="h6" fontWeight={600} mb={2}>
                                Disponibilidad Horaria
                            </Typography>
                            <Box sx={{ overflowX: "auto" }}>
                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            <th></th>
                                            {Object.keys(
                                                paseador.grilla.scheduleData
                                            ).map((dia) => (
                                                <th
                                                    key={dia}
                                                    style={{ padding: 6 }}
                                                >
                                                    {dia}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {["manana", "tarde", "noche"].map(
                                            (franja) => (
                                                <tr key={franja}>
                                                    <td
                                                        style={{
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {franja
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            franja.slice(1)}
                                                    </td>
                                                    {Object.keys(
                                                        paseador.grilla
                                                            .scheduleData
                                                    ).map((dia) => (
                                                        <td
                                                            key={dia + franja}
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            {paseador.grilla
                                                                .scheduleData[
                                                                dia
                                                            ][franja]
                                                                ? "✔️"
                                                                : "❌"}
                                                        </td>
                                                    ))}
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </Box>
                            <Box mt={2}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Los turnos son aproximados. Para coordinar
                                    horarios exactos, comunicate con{" "}
                                    <strong>
                                        {paseador.datosUsuario?.nombreCompleto}
                                    </strong>
                                    .
                                </Typography>
                            </Box>
                        </Box>
                    )}

                     {tabIndex === 3 && (
                        <Box mt={3}>
                            <Valoraciones idPaseador={paseador.id} />
                        </Box>
                    )} 
                </Grid>
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "end", mt: 2 }}>
                <Button
                    variant="contained"
                    color="info"
                    onClick={() => navigate(-1)}
                >
                    Volver
                </Button>
            </Box>
        </Container>
    );
};

export default PerfilPaseador;
