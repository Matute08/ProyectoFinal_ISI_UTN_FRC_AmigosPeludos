// Versión mejorada del perfil del cuidador, alineada con el componente 'Perfil' del sistema actual

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
import { getCuidadoresId } from "../../api/cuidadoresApi";
import CustomLoader from "../../components/CustomLoader";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Valoraciones from "../../components/valoraciones";


const PerfilCuidador = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cuidador, setCuidador] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await getCuidadoresId(id);
            setCuidador(res.data);
            } 
        catch (error) {
            console.error("Error al cargar cuidador:", error);
            } 
        finally { setLoading(false);}
    };
    fetchData();}, [id]);
    
    const openWhatsApp = () => {
        const telefono = cuidador?.datosUsuario?.celular;
        const mensaje = "¡Hola! Necesito tu servicio de cuidador!";
        window.open(
            `https://wa.me/+54${telefono}?text=${encodeURIComponent(mensaje)}`,
            "_blank"
        );
    };

    if (loading) return <CustomLoader />;
    if (!cuidador)
        return <Typography>Error cargando datos del cuidador.</Typography>;

    return (
        <Container sx={{ mt: 4, borderRadius: 4, pb: 4, minHeight: "auto" }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            mb={2}
                        >
                            <Avatar
                                src={cuidador.datosUsuario?.foto}
                                alt={cuidador.datosUsuario?.nombreCompleto}
                                sx={{ width: 100, height: 100, mb: 1 }}
                            />
                            <Typography variant="h6">
                                {cuidador.datosUsuario?.nombreCompleto ||
                                    "Nombre no disponible"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Cuidador
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
                                {cuidador.datosUsuario?.mail}
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                Teléfono
                            </Typography>
                            <Typography variant="body1" mb={1}>
                                {cuidador.datosUsuario?.celular}
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                Género
                            </Typography>
                            <Typography variant="body1" mb={1}>
                                {cuidador.datosUsuario?.generoUsuario}
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                Dirección
                            </Typography>
                            <Typography variant="body1">
                                {cuidador.datosUsuario?.calle}{" "}
                                {cuidador.datosUsuario?.nroCalle},{" "}
                                {cuidador.datosUsuario?.barrioUsuario},{" "}
                                {cuidador.datosUsuario?.ciudadUsuario}
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
                        <Tab label="Datos Cuidador" />
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
                                {cuidador.titulo}
                            </Typography>
                            <Typography variant="body1" mb={2}>
                                <strong>Descripción:</strong>{" "}
                                {cuidador.presentacion}
                            </Typography>
                            <Typography variant="body1" mb={2}>
                                <strong>Precio por hora:</strong> $
                                {cuidador.precioCuidado}
                            </Typography>
                            <Typography variant="body1" mb={2}>
                                <strong>Tipo de Vivienda:</strong>{" "}
                                {cuidador.tipoVivienda}
                            </Typography>
                            <Typography variant="body1" mb={2}>
                                <strong>Experiencia:</strong>{" "}
                                {cuidador.experiencia}
                            </Typography>
                            <Typography variant="body1" mb={2}>
                                <strong>Patio o Balcón:</strong>{" "}
                                {cuidador.patioBalcon ? "Sí" : "No"}
                            </Typography>
                            <Typography variant="body1" mb={2}>
                                <strong>Transporte Propio:</strong>{" "}
                                {cuidador.transportePropio ? "Sí" : "No"}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={openWhatsApp}
                            >
                                Contactar por WhatsApp
                            </Button>
                        </Box>
                    )}

                    {tabIndex === 1 && (
                        <Box mt={3}>
                            {cuidador.fotos?.length > 0 ? (
                                <Carousel
                                    showThumbs={false}
                                    autoPlay
                                    infiniteLoop
                                >
                                    {cuidador.fotos.map((foto, index) => {
                                        const fotoUrl = typeof foto === 'object' ? foto.foto : foto;
                                        return (
                                            <div key={foto.id || index}>
                                                <img
                                                    src={fotoUrl}
                                                    alt="Imagen Cuidador"
                                                    style={{
                                                        borderRadius: 8,
                                                        maxHeight: 350,
                                                        objectFit: "contain",
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
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
                                                cuidador.grilla.scheduleData
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
                                                        cuidador.grilla
                                                            .scheduleData
                                                    ).map((dia) => (
                                                        <td
                                                            key={dia + franja}
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            {cuidador.grilla
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
                                        {cuidador.datosUsuario?.nombreCompleto}
                                    </strong>
                                    .
                                </Typography>
                            </Box>
                        </Box>
                    )}
                    {tabIndex === 3 && (
                    <Box mt={3}>
                        
                        <Valoraciones idCuidador={cuidador.id}  />
                                                
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

export default PerfilCuidador;
