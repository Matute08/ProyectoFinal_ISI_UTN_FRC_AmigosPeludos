import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDetallePublicacion } from "../api/publicacionesApi";
import { Carousel } from "react-responsive-carousel";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Box,
    Button,
    Chip,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FormularioAdopcion from "./FormularioAdopcion";
import CustomLoader from "../components/CustomLoader";
export default function DetallePublicacionAdopcion() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [detalle, setDetalle] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);
        const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        const fetch = async () => {
            const data = await getDetallePublicacion(id);
            setDetalle(data);
            setLoading(false)
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

    return (
        <>
            <Container sx={{ mt: 5, mb: 5, backgroundColor:"#e0d0b8", borderRadius: 4 }}>
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
                    Mascota en Adopción
                </Typography>
                
                <Grid container spacing={4}>
                    {/* Datos de la mascota */}
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
                                    <b>Castrado/a:</b>{" "}
                                    {detalle.castracion ? "Sí" : "No"}
                                </Typography>
                                <Typography>
                                    <b>En adopción desde:</b>{" "}
                                    {detalle.fechaAlta.split("T")[0]}
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

                    {/* Fotos y formulario */}
                    <Grid item size={{ xs: 12, md: 6 }}>
                        <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Fotos
                                </Typography>
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
                                    Postularse para Adoptar
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    Si querés brindarle un hogar a esta mascota,
                                    completá el formulario.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleOpenModal}
                                >
                                    📄 Completar Formulario
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

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

            <Dialog
                open={modalOpen}
                onClose={handleCloseModal}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    Formulario de Adopción
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModal}
                        sx={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <FormularioAdopcion
                        mascotaId={id}
                        onClose={handleCloseModal}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
