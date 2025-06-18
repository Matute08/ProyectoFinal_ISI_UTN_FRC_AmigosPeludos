import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Button,
    Card,
    CardMedia,
    CardContent,
    CircularProgress,
    Alert,
} from "@mui/material";
import { getMascotaId } from "../../../api/mascotasApi";

const placeholder = "/images/placeholder-pet.png";

const ConsultarMascota = ({ mascotaId, onCancel }) => {
    const [mascota, setMascota] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMascota = async () => {
            try {
                const res = await getMascotaId(mascotaId);
                setMascota(res?.data || null);
            } catch {
                setError("No se pudo cargar la información de la mascota.");
            } finally {
                setLoading(false);
            }
        };

        if (mascotaId) fetchMascota();
    }, [mascotaId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box mt={2}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button variant="outlined" onClick={onCancel}>
                    ← Volver
                </Button>
            </Box>
        );
    }

    if (!mascota) {
        return (
            <Box mt={2}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    No se encontró la mascota solicitada.
                </Alert>
                <Button variant="outlined" onClick={onCancel}>
                    ← Volver
                </Button>
            </Box>
        );
    }

    return (
        <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* Imagen */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <CardMedia
                        component="img"
                        image={mascota.foto || placeholder}
                        alt={mascota.nombre}
                        sx={{
                            width: "100%",
                            borderRadius: 2,
                            objectFit: "cover",
                            maxHeight: 400,
                        }}
                    />
                </Grid>

                {/* Información */}
                <Grid item size={{ xs: 12, md: 7 }}>
                    <CardContent>
                        <Typography sx={{display:"flex", justifyContent: "center", pb:2}} variant="h4" gutterBottom>
                            {mascota.nombre || "Mascota sin nombre"}
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid item size={{ xs: 6 }}>
                                <Typography variant="body2">
                                    <strong>Tipo:</strong>{" "}
                                    {mascota.tipoMascotaNombre || "-"}
                                </Typography>
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <Typography variant="body2">
                                    <strong>Raza:</strong>{" "}
                                    {mascota.razaNombre || "No se"}
                                </Typography>
                            </Grid>
                            <Grid item size={{ xs: 12 }}>
                                <Typography variant="body2">
                                    <strong>Edad Aprox.:</strong>{" "}
                                    {mascota.edadMascota || "-"}
                                </Typography>
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <Typography variant="body2">
                                    <strong>Sexo:</strong>{" "}
                                    {mascota.sexoMascota || "-"}
                                </Typography>
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <Typography variant="body2">
                                    <strong>Color:</strong>{" "}
                                    {mascota.color || "-"}
                                </Typography>
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <Typography variant="body2">
                                    <strong>Castrado/a:</strong>{" "}
                                    {typeof mascota.castracion === "boolean"
                                        ? mascota.castracion
                                            ? "Sí"
                                            : "No"
                                        : "-"}
                                </Typography>
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <Typography variant="body2">
                                    <strong>Peso Aprox.:</strong>{" "}
                                    {mascota.peso ? `${mascota.peso} kg` : "-"}
                                </Typography>
                            </Grid>
                        </Grid>

                        {mascota.descripcion && (
                            <>
                                <Box mt={3}>
                                    <Typography variant="subtitle1">
                                        Descripción:
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {mascota.descripcion}
                                    </Typography>
                                </Box>
                            </>
                        )}

                        <Box mt={4}>
                            <Button variant="contained" onClick={onCancel}>
                                ← Volver
                            </Button>
                        </Box>
                    </CardContent>
                </Grid>
            </Grid>
        </Card>
    );
};

export default ConsultarMascota;
