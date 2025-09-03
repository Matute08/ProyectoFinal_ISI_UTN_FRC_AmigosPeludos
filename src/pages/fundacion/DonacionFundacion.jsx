import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Avatar,
    Button,
    Stack,
    Paper,
    Grid,
    IconButton,
    Tooltip,
    Divider,
    Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ContentCopy as CopyIcon } from "@mui/icons-material";
import { Facebook, Instagram, Language } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { getFundacionId } from "../../api/fundacionesApi";
import Maps from "../../components/Maps";
import MP_LOGO from "../../assets/mercadopago.png";
import Swal from "sweetalert2";

const MP_MONTOS = [1000, 2000, 5000, 10000];

const DonacionFundacion = () => {
    const { idFunda } = useParams();
    const navigate = useNavigate();

    const [fundacion, setFundacion] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getFundacionId(idFunda);
                setFundacion(res.data);
            } catch {
                setFundacion(null);
            }
        };
        fetch();
    }, [idFunda]);

    const corregirUrl = (url) =>
        url?.startsWith("http") ? url : `https://${url}`;

    const handleCopy = async (text, tipo) => {
        try {
            await navigator.clipboard.writeText(text);
            Swal.fire({
                title: "¡Copiado!",
                text: `${tipo} copiado al portapapeles`,
                icon: "success",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                background: "#4caf50",
                color: "white",
                customClass: {
                    popup: "swal2-toast",
                },
            });
        } catch (error) {
            console.error("Error al copiar:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo copiar al portapapeles",
                icon: "error",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                background: "#f44336",
                color: "white",
            });
        }
    };

    if (!fundacion) {
        return (
            <Box py={10} display="flex" justifyContent="center">
                <Typography variant="h6">Cargando...</Typography>
            </Box>
        );
    }

    return (
        <Container sx={{ mt: 4, backgroundColor: "#e0d0b8", borderRadius: 4 }}>
            {/* Titulo */}
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "2rem", sm: "2.5rem" },
                    textAlign: "center",
                }}
            >
                Detalle de la Fundación
            </Typography>
            <Box sx={{ maxWidth: 900, mx: "auto", py: 6 }}>
                <Paper
                    sx={{ p: { xs: 2, md: 4 }, borderRadius: 6, boxShadow: 6 }}
                >
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={4}
                        alignItems="center"
                    >
                        <Box
                            flex={{ xs: "unset", md: 1 }}
                            width={{ xs: "100%", md: "auto" }}
                            textAlign={{ xs: "center", md: "left" }}
                            mb={{ xs: 4, md: 0 }}
                        >
                            <Avatar
                                src={fundacion.imagen}
                                alt={fundacion.nombre}
                                sx={{
                                    width: "100%",
                                    height: 200,
                                    mb: 2,
                                    mx: { xs: "auto", md: 0 },
                                    boxShadow: 2,
                                }}
                                imgProps={{
                                    style: {
                                        objectFit: "contain", // O "contain" según prefieras
                                        width: "100%",
                                        height: "100%",
                                    },
                                }}
                                variant="rounded"
                            />
                            <Typography
                                variant="h4"
                                fontWeight={700}
                                color="primary.main"
                                gutterBottom
                            >
                                {fundacion.nombre}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                mb={1}
                            >
                                {fundacion.direccion} {fundacion.nroCalle} ·{" "}
                                {fundacion.barrio}
                            </Typography>
                            <Divider
                                sx={{ my: 2, mx: "auto", maxWidth: 260 }}
                            />
                            <Typography
                                variant="body1"
                                mb={2}
                                color="text.secondary"
                                sx={{
                                    wordBreak: "break-word",
                                    whiteSpace: "pre-line",
                                    width: "100%",
                                }}
                            >
                                {fundacion.descripcion}
                            </Typography>
                            <Paper
                                sx={{
                                    bgcolor: "#fff7e6",
                                    p: 2,
                                    mb: 2,
                                    borderRadius: 3,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    color="secondary.main"
                                    gutterBottom
                                >
                                    ¿Por qué necesita tu ayuda?
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        wordBreak: "break-word",
                                        whiteSpace: "pre-line",
                                        width: "100%",
                                    }}
                                >
                                    {fundacion.motivoDonaciones ||
                                        "Esta fundación necesita tu colaboración para seguir ayudando a los animales que más lo necesitan."}
                                </Typography>
                            </Paper>
                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                color="text.secondary"
                                mt={2}
                                mb={0.5}
                                textAlign={{ xs: "center", md: "left" }}
                            >
                                Visítalos en sus redes sociales
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={1}
                                justifyContent={{
                                    xs: "center",
                                    md: "flex-start",
                                }}
                                mb={1}
                            >
                                {fundacion.paginaUrl && (
                                    <Tooltip title="Página web">
                                        <IconButton
                                            component="a"
                                            href={corregirUrl(
                                                fundacion.paginaWeb
                                            )}
                                            target="_blank"
                                            rel="noopener"
                                        >
                                            <Language color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {fundacion.facebook && (
                                    <Tooltip title="Facebook">
                                        <IconButton
                                            component="a"
                                            href={corregirUrl(
                                                fundacion.facebook
                                            )}
                                            target="_blank"
                                            rel="noopener"
                                        >
                                            <Facebook color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {fundacion.instagram && (
                                    <Tooltip title="Instagram">
                                        <IconButton
                                            component="a"
                                            href={corregirUrl(
                                                fundacion.instagram
                                            )}
                                            target="_blank"
                                            rel="noopener"
                                        >
                                            <Instagram color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Stack>
                        </Box>
                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{ display: { xs: "none", md: "block" } }}
                        />
                        {/* DATOS Y DONACIÓN */}
                        <Box
                            flex={{ xs: "unset", md: 1.2 }}
                            width={{ xs: "100%", md: "auto" }}
                            textAlign="center"
                        >
                            <Typography variant="h5" fontWeight={700} mb={2}>
                                Doná con tu banco o Mercado Pago
                            </Typography>
                            <Paper
                                variant="outlined"
                                sx={{
                                    borderRadius: 3,
                                    bgcolor: "#eaf6f5",
                                    p: 2,
                                    mb: 3,
                                    display: "inline-block",
                                    minWidth: 270,
                                }}
                            >
                                <Stack spacing={1}>
                                    <Typography fontWeight={600}>
                                        CBU
                                    </Typography>
                                    <Box
                                        sx={{
                                            fontFamily: "monospace",
                                            letterSpacing: 1,
                                            fontSize: 18,
                                            px: 1,
                                            py: 0.5,
                                            bgcolor: "#fff",
                                            borderRadius: 2,
                                            display: "inline-flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        {fundacion.cbu}
                                        <Tooltip title="Copiar">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    handleCopy(fundacion.cbu, "CBU")
                                                }
                                                sx={{ ml: 1 }}
                                            >
                                                <CopyIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Typography fontWeight={600} mt={2}>
                                        Alias
                                    </Typography>
                                    <Box
                                        sx={{
                                            fontFamily: "monospace",
                                            letterSpacing: 1,
                                            fontSize: 18,
                                            px: 1,
                                            py: 0.5,
                                            bgcolor: "#fff",
                                            borderRadius: 2,
                                            display: "inline-flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        {fundacion.aliasCbu}
                                        <Tooltip title="Copiar">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    handleCopy(
                                                        fundacion.aliasCbu,
                                                        "Alias"
                                                    )
                                                }
                                                sx={{ ml: 1 }}
                                            >
                                                <CopyIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Stack>
                            </Paper>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                mb={2}
                            >
                                Transferí directo con tus datos bancarios, ¡o
                                doná fácil con Mercado Pago!
                            </Typography>
                            <Box mb={2}>
                                <Stack
                                    direction="row"
                                    justifyContent="center"
                                    spacing={2}
                                    flexWrap="wrap"
                                    rowGap={1}
                                >
                                    {MP_MONTOS.map((amount) => (
                                        <Button
                                            key={amount}
                                            variant={
                                                selectedAmount === amount
                                                    ? "contained"
                                                    : "outlined"
                                            }
                                            startIcon={
                                                <Box
                                                    sx={{
                                                        width: 50,
                                                        height: 50,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                >
                                                    <img
                                                        src={MP_LOGO}
                                                        alt="Mercado Pago"
                                                        style={{
                                                            maxWidth: "100%",
                                                            maxHeight: "100%",
                                                            objectFit:
                                                                "contain",
                                                            display: "block",
                                                        }}
                                                    />
                                                </Box>
                                            }
                                            sx={{
                                                bgcolor:
                                                    selectedAmount === amount
                                                        ? "#00a6ff"
                                                        : "white",
                                                color:
                                                    selectedAmount === amount
                                                        ? "white"
                                                        : "#00a6ff",
                                                borderColor: "#00a6ff",
                                                fontWeight: 600,
                                                px: 3,
                                                fontSize: 18,
                                                borderRadius: 99,
                                                "&:hover": {
                                                    bgcolor: "#0091d4",
                                                    color: "white",
                                                },
                                            }}
                                            onClick={() =>
                                                setSelectedAmount(amount)
                                            }
                                        >
                                            ${amount}
                                        </Button>
                                    ))}
                                </Stack>
                                {selectedAmount && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        sx={{
                                            mt: 3,
                                            px: 5,
                                            borderRadius: 99,
                                            fontWeight: 700,
                                            fontSize: 18,
                                            textTransform: "none",
                                            boxShadow: "0 2px 8px #00a6ff33",
                                        }}
                                        // onClick={() => ... integración Mercado Pago }
                                        href="https://www.mercadopago.com.ar/" // luego ponés la URL de preferencia
                                        target="_blank"
                                    >
                                        Donar ${selectedAmount}
                                    </Button>
                                )}
                            </Box>

                            <Typography variant="h5" fontWeight={700} mb={2}>
                                Ubicación
                            </Typography>

                            <Maps 
                                markers={[
                                    {
                                        latitud: fundacion.latitud,
                                        longitud: fundacion.longitud,
                                        label: fundacion.nombre || "Fundación",
                                    },
                                ]}
                                center={[fundacion.latitud, fundacion.longitud]} // Centra en la mascota
                                zoom={18}
                            />
                            <Box></Box>
                        </Box>
                    </Stack>
                </Paper>
            </Box>
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
};

export default DonacionFundacion;
