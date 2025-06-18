import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
    Container,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import Assignment from "@mui/icons-material/Assignment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVacunasMascota } from "../../../../api/vacunaApi";
import { getMascotaId } from "../../../../api/mascotasApi";
import ModalCargarVacuna from "./ModalCargarVacuna";
import CarnetDigitalMascota from "./CarnetDigitalMascota";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
const VacunacionMascota = () => {
    const { mascotaId } = useParams();
    const [vacunas, setVacunas] = useState([]);
    const [mascota, setMascota] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [openCarnet, setOpenCarnet] = useState(false);
    const [expandedVacunas, setExpandedVacunas] = useState({});
    const fetchVacunas = async () => {
        try {
            const res = await getVacunasMascota(mascotaId);
            setVacunas(res.data);
        } catch (err) {
            console.error("Error cargando vacunas aplicadas", err);
            setVacunas([]);
        }
    };

    const fetchMascota = async () => {
        try {
            const res = await getMascotaId(mascotaId);
            setMascota(res.data);
        } catch (err) {
            console.error("Error cargando mascota", err);
        }
    };

    useEffect(() => {
        const id = parseInt(mascotaId, 10);
        if (!isNaN(id)) {
            fetchVacunas(id);
            fetchMascota(id);
        }
    }, [mascotaId]);
    const toggleExpand = (nombre) => {
        setExpandedVacunas((prev) => ({
            ...prev,
            [nombre]: !prev[nombre],
        }));
    };
    const calcularProxima = (fechaAplicacion, semanas) => {
        const f = new Date(fechaAplicacion);
        f.setDate(f.getDate() + semanas * 7);
        return f.toLocaleDateString();
    };

    // Agrupar vacunas por nombre
    const vacunasAgrupadas = vacunas.reduce((acc, v) => {
        const nombre = v.vacuna?.nombre || v.nombreVacuna;
        if (!acc[nombre]) acc[nombre] = [];
        acc[nombre].push(v);
        return acc;
    }, {});

    Object.values(vacunasAgrupadas).forEach((lista) => {
        lista.sort(
            (a, b) => new Date(b.fechaAplicacion) - new Date(a.fechaAplicacion)
        );
    });

    return (
        <Container sx={{ mt: 4, backgroundColor:"#e0d0b8", borderRadius: 4 }}>
            <Box sx={{ padding: 4 }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        fontSize: { xs: "1.8rem", sm: "2.4rem" },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                    }}
                >
                    🩺 Carnet de Vacunación
                </Typography>

                <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{
                        fontSize: { xs: "1rem", sm: "1.3rem" },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                        color: "text.secondary",
                    }}
                >
                    A continuación podés consultar las vacunas aplicadas y
                    cargar nuevas dosis.
                </Typography>

                <Box
                    display="flex"
                    justifyContent="center"
                    gap={2}
                    mb={4}
                    flexWrap="wrap"
                >
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                            backgroundColor: "#f57c00",
                            "&:hover": { backgroundColor: "#ef6c00" },
                        }}
                        onClick={() => setModalOpen(true)}
                    >
                        Cargar nueva vacuna
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Assignment />}
                        onClick={() => setOpenCarnet(true)}
                    >
                        Visualizar carnet
                    </Button>
                </Box>

                <CarnetDigitalMascota
                    open={openCarnet}
                    onClose={() => setOpenCarnet(false)}
                    vacunas={vacunas}
                    mascota={mascota}
                />

                {vacunas.length === 0 ? (
                    <Box textAlign="center" mt={6}>
                        <VaccinesIcon sx={{ fontSize: 60, color: "#ccc" }} />
                        <Typography variant="h6" color="text.secondary" mt={2}>
                            Aún no hay vacunas registradas 🐾
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Comenzá cargando la primera dosis
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3} alignItems="flex-start">

                        {Object.entries(vacunasAgrupadas).map(
                            ([nombre, lista]) => {
                                const expanded =
                                    expandedVacunas[nombre] || false;

                                return (
                                    <Grid
                                        size={{ xs: 12, md: 6, lg: 4 }}
                                        key={nombre}
                                    >
                                        <Card
                                            sx={{
                                                height: "100%",
                                                borderLeft: "5px solid #008fed",
                                                boxShadow: 3,
                                                transition: "transform 0.2s",
                                                "&:hover": {
                                                    transform: "scale(1.02)",
                                                },
                                            }}
                                        >
                                            <CardContent>
                                                <Typography
                                                    variant="h6"
                                                    gutterBottom
                                                >
                                                    💉 {nombre} ({lista.length}{" "}
                                                    dosis)
                                                </Typography>

                                                {/* Última dosis visible siempre */}
                                                {lista.slice(0, 1).map((v) => {
                                                    const aplicada = new Date(
                                                        v.fechaAplicacion
                                                    ).toLocaleDateString();
                                                    const proxima =
                                                        v.fechaProxima
                                                            ? new Date(
                                                                  v.fechaProxima
                                                              ).toLocaleDateString()
                                                            : v.vacuna
                                                                    ?.frecuenciaSemanas
                                                              ? calcularProxima(
                                                                    v.fechaAplicacion,
                                                                    v.vacuna
                                                                        .frecuenciaSemanas
                                                                )
                                                              : "No registrada";

                                                    const estado =
                                                        v.fechaProxima
                                                            ? new Date(
                                                                  v.fechaProxima
                                                              ) > new Date()
                                                                ? "🟢 Al día"
                                                                : "🔴 Vencida"
                                                            : v.vacuna
                                                                    ?.frecuenciaSemanas
                                                              ? "🟢 Al día (estimado)"
                                                              : "🔴 Sin próxima fecha";

                                                    return (
                                                        <Box
                                                            key={v.id}
                                                            mb={2}
                                                            p={1}
                                                            sx={{
                                                                backgroundColor:
                                                                    "#f9f9f9",
                                                                borderRadius: 2,
                                                            }}
                                                        >
                                                            <Typography variant="subtitle2">
                                                                Última dosis
                                                                (Dosis{" "}
                                                                {lista.length})
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                📅 Aplicada:{" "}
                                                                {aplicada}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                🕒 Próxima:{" "}
                                                                {proxima}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                🩺 Estado:{" "}
                                                                {estado}
                                                            </Typography>
                                                        </Box>
                                                    );
                                                })}

                                                {/* Botón toggle historial */}
                                                {lista.length > 1 && (
                                                    <Button
                                                        size="small"
                                                        onClick={() =>
                                                            toggleExpand(nombre)
                                                        }
                                                        startIcon={
                                                            expanded ? (
                                                                <ExpandLessIcon />
                                                            ) : (
                                                                <ExpandMoreIcon />
                                                            )
                                                        }
                                                        sx={{ mb: 1 }}
                                                    >
                                                        {expanded
                                                            ? "Ocultar historial"
                                                            : "Ver historial"}
                                                    </Button>
                                                )}

                                                {/* Historial colapsado */}
                                                {expanded &&
                                                    lista
                                                        .slice(1)
                                                        .map((v, i) => {
                                                            const aplicada =
                                                                new Date(
                                                                    v.fechaAplicacion
                                                                ).toLocaleDateString();
                                                            const proxima =
                                                                v.fechaProxima
                                                                    ? new Date(
                                                                          v.fechaProxima
                                                                      ).toLocaleDateString()
                                                                    : v.vacuna
                                                                            ?.frecuenciaSemanas
                                                                      ? calcularProxima(
                                                                            v.fechaAplicacion,
                                                                            v
                                                                                .vacuna
                                                                                .frecuenciaSemanas
                                                                        )
                                                                      : "No registrada";

                                                            const estado =
                                                                v.fechaProxima
                                                                    ? new Date(
                                                                          v.fechaProxima
                                                                      ) >
                                                                      new Date()
                                                                        ? "🟢 Al día"
                                                                        : "🔴 Vencida"
                                                                    : v.vacuna
                                                                            ?.frecuenciaSemanas
                                                                      ? "🟢 Al día (estimado)"
                                                                      : "🔴 Sin próxima fecha";

                                                            return (
                                                                <Box
                                                                    key={v.id}
                                                                    mb={1}
                                                                    p={1}
                                                                    sx={{
                                                                        backgroundColor:
                                                                            "#f1f1f1",
                                                                        borderRadius: 2,
                                                                    }}
                                                                >
                                                                    <Typography variant="subtitle2">
                                                                        Dosis{" "}
                                                                        {lista.length -
                                                                            (i +
                                                                                1)}
                                                                    </Typography>
                                                                    <Typography variant="body2">
                                                                        📅
                                                                        Aplicada:{" "}
                                                                        {
                                                                            aplicada
                                                                        }
                                                                    </Typography>
                                                                    <Typography variant="body2">
                                                                        🕒
                                                                        Próxima:{" "}
                                                                        {
                                                                            proxima
                                                                        }
                                                                    </Typography>
                                                                    <Typography variant="body2">
                                                                        🩺
                                                                        Estado:{" "}
                                                                        {estado}
                                                                    </Typography>
                                                                </Box>
                                                            );
                                                        })}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            }
                        )}
                    </Grid>
                )}

                <ModalCargarVacuna
                    open={modalOpen}
                    handleClose={() => setModalOpen(false)}
                    idMascota={mascotaId}
                    onSuccess={fetchVacunas}
                />
            </Box>
        </Container>
    );
};

export default VacunacionMascota;
