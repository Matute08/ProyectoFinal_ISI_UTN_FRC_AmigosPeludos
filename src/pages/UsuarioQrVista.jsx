import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Avatar,
    CircularProgress,
    Button,
    Stack,
    Container,
    Alert,
    Paper,
    Divider,
} from "@mui/material";
import { getUserId } from "../api/userApi";
import CustomLoader from "../components/CustomLoader";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PetsIcon from "@mui/icons-material/Pets";
import PhoneIcon from "@mui/icons-material/Phone";
const UsuarioQrVista = () => {
    const { id } = useParams();
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const res = await getUserId(id);
                setUsuario(res.data);
            } catch (err) {
                console.error("Error al cargar usuario:", err);
                setError("No se pudo cargar la información del usuario.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsuario();
    }, [id]);

    if (loading) {
        return (
            <Container sx={{ textAlign: "center", mt: 5 }}>
                <CustomLoader />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ mt: 6 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!usuario) {
        return null;
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 6 }}>
            <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
                <PetsIcon fontSize="large" color="primary" />
                <Typography variant="h5" mt={2} gutterBottom>
                    Esta mascota pertenece a:
                </Typography>

                <Avatar
                    src={usuario.foto || ""}
                    sx={{ width: 120, height: 120, margin: "16px auto" }}
                />

                <Typography variant="h6" gutterBottom>
                    {usuario.nombreCompleto}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={1} alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                        <LocationOnIcon color="action" />
                        <Typography color="text.secondary">
                            {usuario.ciudadUsuario || "-"},{" "}
                            {usuario.barrioUsuario || "-"}
                        </Typography>
                    </Box>

                    {usuario.celular && (
                        <>
                            <Box display="flex" alignItems="center" gap={1}>
                                <WhatsAppIcon color="success" />
                                <Button
                                    variant="contained"
                                    color="success"
                                    href={`https://wa.me/54${usuario.celular}?text=Hola, encontré tu mascota!`}
                                    target="_blank"
                                    size="small"
                                >
                                    WhatsApp
                                </Button>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1}>
                                <PhoneIcon color="primary" />
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    href={`tel:${usuario.celular}`}
                                    size="small"
                                >
                                    Llamar
                                </Button>
                            </Box>
                        </>
                    )}

                    {usuario.mail && (
                        <Box display="flex" alignItems="center" gap={1}>
                            <EmailIcon color="action" />
                            <Button
                                variant="outlined"
                                href={`mailto:${usuario.mail}`}
                                target="_blank"
                                size="small"
                            >
                                Enviar correo
                            </Button>
                        </Box>
                    )}
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Typography variant="body2" color="text.secondary">
                    Si encontraste una mascota con este código QR, por favor
                    contactá a su dueño a través de los medios disponibles.
                </Typography>
            </Paper>
        </Container>
    );
};

export default UsuarioQrVista;
