import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Paper,
    Button,
    CircularProgress,
    Container,
} from "@mui/material";
import { getDetallePublicacion } from "../../../api/publicacionesApi";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Carousel } from "react-responsive-carousel";

import "leaflet/dist/leaflet.css";
import CustomLoader from "../../../components/CustomLoader";
import Maps from "../../../components/Maps";
import CambiarEstadoPublicacion from "../../../components/CambiarEstadoPublicacion";
import { useAuth } from "../../../auth/AuthProvider";
const ConsultarPublicacion = ({ id, onCancel }) => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalEstadoAbierto, setModalEstadoAbierto] = useState(false);
    const { userData } = useAuth();

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getDetallePublicacion(id);
                setPost(res);
            } catch (e) {
                console.error("Error al obtener publicación", e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    if (loading) {
        return (
            <Container sx={{ textAlign: "center", mt: 5 }}>
                <CustomLoader />
            </Container>
        );
    }
    if (!post) {
        return <Typography>Error al cargar la publicación.</Typography>;
    }

    const esCreador = userData?.id === post.usuarioId;
    const esActiva = post.estado === 'Activa' || !post.estado;

    // Utilidad para formatear fecha a DD/MM/AAAA
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        if (isNaN(date)) return dateStr;
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleEstadoCambiado = () => {
        // Recargar la publicación para obtener el estado actualizado
        const fetch = async () => {
            try {
                const res = await getDetallePublicacion(id);
                setPost(res);
            } catch (e) {
                console.error("Error al obtener publicación actualizada", e);
            }
        };
        fetch();
    };


    return (
        <Box mt={2}>
            <Typography
                variant="h4"
                sx={{ display: "flex", justifyContent: "center" }}
                gutterBottom
            >
                Detalle de Mascota {post.publicacionTipo}
            </Typography>

            <Grid container spacing={2}>
                <Grid item size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Datos de la Mascota
                        </Typography>
                        <Typography>Nombre: {post.nombre}</Typography>
                        <Typography>Tipo: {post.tipoMascotaNombre}</Typography>
                        <Typography>Raza: {post.razaNombre}</Typography>
                        <Typography>Edad Aprox.: {post.edadMascota}</Typography>
                        <Typography>Sexo: {post.sexoMascota}</Typography>
                        <Typography>Color: {post.color}</Typography>
                        <Typography>
                            Castrado/a: {post.castrado ? "Sí" : "No"}
                        </Typography>
                        <Typography>
                            {post.publicacionTipo === "Perdida"
                                ? `Perdida el: ${formatDate(post.fechaPerdida)}`
                                : `En adopción desde: ${formatDate(post.fechaAlta)}`}
                        </Typography>
                        <Typography>
                            Estado: <strong>{post.estado || 'Activa'}</strong>
                            {post.fechaFinalizada && (
                                <span> - Finalizada el: {formatDate(post.fechaFinalizada)}</span>
                            )}
                        </Typography>
                        <Typography>
                            Barrio: {post.barrioPublicacion}
                        </Typography>
                        <Typography>
                            Ciudad: {post.ciudadPublicacion}
                        </Typography>
                        {post.descripcion && (
                            <>
                                <Typography mt={1}>
                                    Descripción Adicional:
                                </Typography>
                                <Typography color="text.secondary">
                                    {post.descripcion}
                                </Typography>
                            </>
                        )}
                    </Paper>
                </Grid>

                <Grid item size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Fotos
                        </Typography>
                        {post.fotos?.length > 1 ? (
                            <Carousel
                                showThumbs={false}
                                showStatus={false}
                                infiniteLoop
                                emulateTouch
                                dynamicHeight={false}
                                swipeable
                            >
                                {post.fotos.map((f, i) => (
                                    <div key={i}>
                                        <img
                                            src={f.foto}
                                            alt={`Foto ${i + 1}`}
                                            style={{
                                                width: "100%",
                                                height: 300,
                                                objectFit: "contain",
                                                borderRadius: 8,
                                                marginTop: 8,
                                            }}
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        ) : (
                            <img
                                src={
                                    post.fotos?.[0]?.foto || "/placeholder.png"
                                }
                                alt="Mascota"
                                style={{
                                    width: "100%",
                                    height: 300,
                                    objectFit: "contain",
                                    borderRadius: 8,
                                    marginTop: 8,
                                }}
                            />
                        )}
                    </Paper>
                </Grid>

                <Grid item size={{ xs: 12 }}>
                    {(post.publicacionTipo === "Perdida" ||
                        post.publicacionTipo === "Encontrada") && (
                        <Paper sx={{ mt: 2, p: 2 }}>
                            <Typography variant="h5" gutterBottom>
                                Ubicación de Referencia
                            </Typography>

                            <Maps
                                markers={[
                                    {
                                        latitud: post.latitud,
                                        longitud: post.longitud,
                                        label: post.nombre || "Mascota",
                                    },
                                ]}
                                center={[post.latitud, post.longitud]} // Centra en la mascota
                                zoom={18}
                            />

                           
                        </Paper>
                    )}
                </Grid>

                <Grid item size={{ xs: 12 }}>
                    {post.publicacionTipo === "Adopcion" ? (
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h5" gutterBottom>
                                Formulario
                            </Typography>

                            <Button variant="contained" sx={{ mt: 1 }}>
                                📝 Revisar Formulario
                            </Button>
                        </Paper>
                    ) : (
                        <Paper sx={{ mt: 2, p: 2 }}>
                            <Typography variant="h5" gutterBottom>
                                Contacto
                            </Typography>
                            <Typography mb={1}>
                                Si tenés información o estás interesado:
                            </Typography>
                            <Button
                                variant="outlined"
                                color="success"
                                href={`https://wa.me/${post.telefono}`}
                                target="_blank"
                                sx={{ mr: 1 }}
                            >
                                WhatsApp
                            </Button>
                            <Button
                                variant="outlined"
                                href={`mailto:${post.email}`}
                                target="_blank"
                            >
                                Enviar Mail
                            </Button>
                        </Paper>
                    )}
                </Grid>

                <Grid item size={{ xs: 12 }} sx={{ textAlign: "end" }}>
                    <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
                        {esCreador && esActiva && (
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => setModalEstadoAbierto(true)}
                                sx={{ 
                                    background: "linear-gradient(45deg, #4caf50, #66bb6a)",
                                    "&:hover": {
                                        background: "linear-gradient(45deg, #388e3c, #4caf50)"
                                    }
                                }}
                            >
                                ✅ Finalizar Publicación
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onCancel}
                        >
                            ← Volver al listado
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            {/* Modal para cambiar estado */}
            <CambiarEstadoPublicacion
                open={modalEstadoAbierto}
                onClose={() => setModalEstadoAbierto(false)}
                publicacionId={id}
                onEstadoCambiado={handleEstadoCambiado}
                tipoPublicacion={post.publicacionTipo}
                nombrePublicacionMascota={post.nombre}
            />
        </Box>
    );
};

export default ConsultarPublicacion;
