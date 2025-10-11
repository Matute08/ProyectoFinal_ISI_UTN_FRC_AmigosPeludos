import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDetallePublicacion } from "../api/publicacionesApi";
import { Carousel } from "react-responsive-carousel";
import moment from "moment";

import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Box,
    Button,
    Chip,
    Divider,
} from "@mui/material";
import Maps from "../components/Maps";
import Slider from "react-slick";
import CustomLoader from "../components/CustomLoader";
import { useAuth } from "../auth/AuthProvider";
export default function DetallePublicacionGeneral({ tipo }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [detalle, setDetalle] = useState(null);
    const { userData } = useAuth();

    useEffect(() => {
        const fetch = async () => {
            const data = await getDetallePublicacion(id);
            setDetalle(data);
        };
        fetch();
    }, [id]);
    const formatDate = (fechaISO) => moment(fechaISO).format("DD/MM/YYYY");

    // Verificar si el usuario actual es el creador de la publicación
    const esCreador = userData?.id === detalle?.usuarioId;

    if (!detalle)
        return (
            <Container sx={{ textAlign: "center", mt: 5 }}>
                <CustomLoader />
            </Container>
        );

    return (
        <Container
            sx={{ mt: 5, mb: 5, backgroundColor: "#e0d0b8", borderRadius: 4 }}
        >
            {/* Titulo */}
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "2rem", sm: "2.5rem" },
                    textAlign: "center",
                    pb:4
                }}
            >
                Detalle de Mascota {tipo}
            </Typography>
            

            {/* Datos de la mascota */}
            <Grid container spacing={4}>
                <Grid item size={{ xs: 12, md: 6 }}>
                    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Información General
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography>
                                <b>Tipo:</b> {detalle.tipoMascotaNombre}
                            </Typography>
                            <Typography>
                                <b>Raza:</b> {detalle.razaNombre}
                            </Typography>
                            <Typography>
                                <b>Edad:</b> {detalle.edadMascota}
                            </Typography>
                            <Typography>
                                <b>Sexo:</b> {detalle.sexoMascota}
                            </Typography>
                            <Typography>
                                <b>Color:</b> {detalle.color || "No informado"}
                            </Typography>
                            
                            <Typography>
                                <b>{tipo} el:</b>{" "}
                                {formatDate(detalle.fechaAlta)}
                            </Typography>
                            <Typography>
                                <b>Barrio:</b> {detalle.barrioPublicacion}
                            </Typography>
                            <Typography>
                                <b>Ciudad:</b> {detalle.ciudadPublicacion}
                            </Typography>
                            <Box mt={2}>
                                <Typography>
                                    <b>Descripción Adicional:</b>
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {detalle.descripcion ||
                                        "Sin descripción adicional."}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Fotos y mapa */}
                <Grid item size={{ xs: 12, md: 6 }}>
                    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6">Foto</Typography>
                            {detalle.fotos?.length > 1 ? (
                                <Carousel
                                    showThumbs={false}
                                    showStatus={false}
                                    infiniteLoop
                                    emulateTouch
                                    dynamicHeight={false}
                                    swipeable
                                >
                                    {detalle.fotos.map((f, i) => (
                                        <div key={i}>
                                            <img
                                                src={f.foto}
                                                alt={`Foto ${i + 1}`}
                                                style={{
                                                    maxHeight: 450,
                                                    objectFit: "contain",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                        </div>
                                    ))}
                                </Carousel>
                            ) : (
                                <img
                                    src={
                                        detalle.fotos?.[0]?.foto ||
                                        "/placeholder.png"
                                    }
                                    alt="Mascota"
                                    style={{
                                        width: "100%",
                                        height: 300,
                                        objectFit: "contain",
                                        borderRadius: 8,
                                    }}
                                />
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item size={{ xs: 12, md: 12 }}>
                    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Ubicación de Referencia
                            </Typography>
                            {/* <Maps
                                latitud={detalle.latitud}
                                longitud={detalle.longitud}
                                isClickable={false}
                            /> */}

                            <Maps
                                markers={[
                                    {
                                        latitud: detalle.latitud,
                                        longitud: detalle.longitud,
                                        label: detalle.nombre || "Mascota",
                                    },
                                ]}
                                center={[detalle.latitud, detalle.longitud]} // Centra en la mascota
                                zoom={18}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Contacto - Solo mostrar si no es el creador */}
            {!esCreador && (
                <Box mt={5}>
                    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6">Contacto</Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Si tienes información sobre esta mascota o deseas
                                comunicarte:
                            </Typography>
                            <Box mt={1} display="flex" flexWrap="wrap" gap={2}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    href={`https://wa.me/?text=Hola, vi una mascota ${tipo.toLowerCase()} en Amigos Peludos y quiero ayudar.`}
                                    target="_blank"
                                >
                                    WhatsApp
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    href={`mailto:${detalle.mailUsuario}`}
                                >
                                    Enviar Correo
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            )}

            {/* Mensaje para el creador */}
            {esCreador && (
                <Box mt={5}>
                    <Card sx={{ borderRadius: 3, boxShadow: 3, bgcolor: "info.light" }}>
                        <CardContent sx={{ textAlign: "center" }}>
                            <Typography variant="h6" color="info.contrastText">
                                ¡Esta es tu publicación!
                            </Typography>
                            <Typography variant="body2" color="info.contrastText" sx={{ mt: 1 }}>
                                Puedes gestionar esta publicación desde tu perfil.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            )}

            {/* Volver */}
            <Box mt={4} sx={{ textAlign: "end" }}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate(-1)}
                >
                    ← Volver
                </Button>
            </Box>
        </Container>
    );
}
