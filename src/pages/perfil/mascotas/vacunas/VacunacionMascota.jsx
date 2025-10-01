import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
    Container,
    Chip,
    IconButton,
    Tooltip,
    Paper,
    Divider,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import Assignment from "@mui/icons-material/Assignment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getVacunas,
    getVacunasMascota,
    deleteDosisVacuna,
    deleteVacunaMascota,
    deleteTodasLasDosisMascota,
} from "../../../../api/vacunaApi";
import { getMascotaId } from "../../../../api/mascotasApi";
import ModalCargarVacuna from "./ModalCargarVacuna";
import ModalEditarVacuna from "./ModalEditarVacuna";
import CarnetDigitalMascota from "./CarnetDigitalMascota";
import CustomLoader from "../../../../components/CustomLoader";
const VacunacionMascota = () => {
    const { mascotaId } = useParams();
    const [vacunas, setVacunas] = useState([]);
    const [mascota, setMascota] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [openCarnet, setOpenCarnet] = useState(false);
    const [modalHistorial, setModalHistorial] = useState(false);
    const [vacunaSeleccionada, setVacunaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actualizandoHistorial, setActualizandoHistorial] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [dosisEditando, setDosisEditando] = useState(null);
    const fetchVacunas = async () => {
        try {
            const res = await getVacunasMascota(mascotaId);
            setVacunas(res.data);
        } catch (err) {
            console.error("Error cargando vacunas aplicadas", err);
            setVacunas([]);
        }
    };

    const handleVacunaCreada = async () => {
        // Solo recargar las vacunas sin cambiar la navegación
        try {
            const res = await getVacunasMascota(mascotaId);
            setVacunas(res.data);
        } catch (err) {
            console.error("Error recargando vacunas:", err);
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

    const fetchData = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchVacunas(), fetchMascota()]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const id = parseInt(mascotaId, 10);
        if (!isNaN(id)) {
            fetchData();
        }
    }, [mascotaId]);
    const abrirModalHistorial = (nombre, lista) => {
        setVacunaSeleccionada({ nombre, lista });
        setModalHistorial(true);
    };

    const cerrarModalHistorial = () => {
        setModalHistorial(false);
        setVacunaSeleccionada(null);
    };

    // Funciones para manejar edición
    const abrirModalEditar = (dosis) => {
        setDosisEditando(dosis);
        setModalEditar(true);
    };

    const cerrarModalEditar = () => {
        setModalEditar(false);
        setDosisEditando(null);
    };

    const handleDosisEditada = async () => {
        // Recargar las vacunas
        await fetchVacunas();

        // Si estamos en el modal de historial, actualizar el historial también
        if (modalHistorial && vacunaSeleccionada) {
            const res = await getVacunasMascota(mascotaId);
            const vacunasActualizadas = res.data;

            const dosisActualizadas = vacunasActualizadas
                .filter((v) => {
                    const nombre = v.vacuna?.nombre || v.nombreVacuna;
                    return nombre === vacunaSeleccionada.nombre;
                })
                .sort(
                    (a, b) =>
                        new Date(b.fechaAplicacion) -
                        new Date(a.fechaAplicacion)
                );

            setVacunaSeleccionada({
                ...vacunaSeleccionada,
                lista: dosisActualizadas,
            });
        }
    };

    // Funciones para manejar eliminaciones
    const confirmarEliminacion = async (tipo, datos) => {
        let titulo = "";
        let texto = "";

        switch (tipo) {
            case "dosis":
                titulo = "¿Eliminar esta dosis?";
                texto = "Esta acción no se puede deshacer";
                break;
            case "vacuna":
                titulo = `¿Eliminar todas las dosis de ${datos.nombre}?`;
                texto = "Esta acción no se puede deshacer";
                break;
            case "todas":
                titulo = "¿Eliminar todas las vacunas?";
                texto = "Esta acción no se puede deshacer";
                break;
        }

        const result = await Swal.fire({
            title: titulo,
            text: texto,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
            customClass: {
                container: "swal-over-mui",
            },
            didOpen: () => {
                // Asegurar que el SweetAlert esté por encima de los modales MUI
                const swalContainer =
                    document.querySelector(".swal2-container");
                if (swalContainer) {
                    swalContainer.style.zIndex = "9999";
                }
            },
        });

        if (result.isConfirmed) {
            ejecutarEliminacion(tipo, datos);
        }
    };

    const ejecutarEliminacion = async (tipo, datos) => {
        try {
            let response;
            let mensajeExito;

            switch (tipo) {
                case "dosis":
                    response = await deleteDosisVacuna(datos.id);
                    mensajeExito = "Dosis eliminada correctamente";
                    break;
                case "vacuna":
                    response = await deleteVacunaMascota(
                        mascotaId,
                        datos.vacunaId
                    );
                    mensajeExito = `Se eliminaron las dosis de ${datos.nombre}`;
                    break;
                case "todas":
                    response = await deleteTodasLasDosisMascota(mascotaId);
                    mensajeExito = "Se eliminaron todas las dosis";
                    break;
                default:
                    throw new Error("Tipo de eliminación no válido");
            }

            // Si estamos en el modal de historial, actualizar el historial
            if (modalHistorial && vacunaSeleccionada) {
                setActualizandoHistorial(true);
                try {
                    // Recargar las vacunas
                    await fetchVacunas();

                    // Actualizar la lista en el modal
                    const res = await getVacunasMascota(mascotaId);
                    const vacunasActualizadas = res.data;

                    // Filtrar las dosis de la vacuna seleccionada
                    const dosisActualizadas = vacunasActualizadas
                        .filter((v) => {
                            const nombre = v.vacuna?.nombre || v.nombreVacuna;
                            return nombre === vacunaSeleccionada.nombre;
                        })
                        .sort(
                            (a, b) =>
                                new Date(b.fechaAplicacion) -
                                new Date(a.fechaAplicacion)
                        );

                    // Si no quedan dosis, cerrar el modal
                    if (dosisActualizadas.length === 0) {
                        cerrarModalHistorial();
                    } else {
                        // Actualizar el estado del modal
                        setVacunaSeleccionada({
                            ...vacunaSeleccionada,
                            lista: dosisActualizadas,
                        });
                    }
                } catch (error) {
                    console.error("Error actualizando historial:", error);
                } finally {
                    setActualizandoHistorial(false);
                }
            } else {
                // Si no estamos en el modal, solo recargar las vacunas
                await fetchVacunas();
            }

            // Mostrar modal de éxito con SweetAlert
            Swal.fire({
                title: "¡Éxito!",
                text: mensajeExito,
                icon: "success",
                timer: 2500,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                customClass: {
                    container: "swal-over-mui",
                },
                didOpen: () => {
                    const swalContainer =
                        document.querySelector(".swal2-container");
                    if (swalContainer) {
                        swalContainer.style.zIndex = "9999";
                    }
                },
            });
        } catch (error) {
            console.error("Error al eliminar:", error);

            let mensajeError = "Error al eliminar. Intenta nuevamente.";

            if (error.response?.status === 403) {
                mensajeError = "No tienes permisos para eliminar esta dosis";
            } else if (error.response?.status === 404) {
                mensajeError = "La dosis no fue encontrada";
            } else if (error.response?.data?.message) {
                mensajeError = error.response.data.message;
            }

            Swal.fire({
                title: "Error",
                text: mensajeError,
                icon: "error",
                timer: 3000,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                customClass: {
                    container: "swal-over-mui",
                },
                didOpen: () => {
                    const swalContainer =
                        document.querySelector(".swal2-container");
                    if (swalContainer) {
                        swalContainer.style.zIndex = "9999";
                    }
                },
            });
        }
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

    if (loading) {
        return <CustomLoader text="Cargando datos de la mascota..." />;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header Section */}
            <Box
                sx={{
                    p: { xs: 2, sm: 4 },
                    mb: { xs: 2, sm: 4 },
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        fontSize: { xs: "1.4rem", sm: "2rem", md: "2.4rem" },
                        fontWeight: "bold",
                        color: "black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: { xs: 1, sm: 2 },
                        mb: { xs: 1, sm: 2 },
                        flexWrap: { xs: "wrap", sm: "nowrap" },
                    }}
                >
                    <VaccinesIcon
                        sx={{
                            fontSize: {
                                xs: "1.8rem",
                                sm: "2.2rem",
                                md: "2.5rem",
                            },
                            color: "#F4A261",
                        }}
                    />
                    <Box sx={{ display: { xs: "block", sm: "inline" } }}>
                        Carnet de Vacunación
                    </Box>
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        opacity: 0.8,
                        mb: { xs: 2, sm: 3 },
                        fontWeight: 400,
                        color: "black",
                        fontSize: { xs: "1rem", sm: "1.25rem" },
                    }}
                >
                    {mascota
                        ? `Gestión de vacunas para ${mascota.nombre}`
                        : "Gestión de vacunas"}
                </Typography>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 1.5, sm: 2 }}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ width: "100%" }}
                >
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddIcon />}
                        sx={{
                            backgroundColor: "#F4A261",
                            color: "white",
                            border: "2px solid #F4A261",
                            "&:hover": {
                                backgroundColor: "#E76F51",
                                border: "2px solid #E76F51",
                            },
                            fontWeight: "bold",
                            px: { xs: 2, sm: 3 },
                            py: { xs: 1, sm: 1.5 },
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                            width: { xs: "100%", sm: "auto" },
                            maxWidth: { xs: "280px", sm: "none" },
                        }}
                        onClick={() => setModalOpen(true)}
                    >
                        <Box sx={{ display: { xs: "none", sm: "inline" } }}>
                            Cargar nueva vacuna
                        </Box>
                        <Box sx={{ display: { xs: "inline", sm: "none" } }}>
                            Nueva vacuna
                        </Box>
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        startIcon={<Assignment />}
                        sx={{
                            borderColor: "#F4A261",
                            color: "#F4A261",
                            borderWidth: "2px",
                            "&:hover": {
                                backgroundColor: "#F4A261",
                                color: "white",
                                borderColor: "#F4A261",
                                borderWidth: "2px",
                            },
                            fontWeight: "bold",
                            px: { xs: 2, sm: 3 },
                            py: { xs: 1, sm: 1.5 },
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                            width: { xs: "100%", sm: "auto" },
                            maxWidth: { xs: "280px", sm: "none" },
                        }}
                        onClick={() => setOpenCarnet(true)}
                        disabled={loading || !mascota || !mascota.nombre}
                    >
                        <Box sx={{ display: { xs: "none", sm: "inline" } }}>
                            Visualizar carnet
                        </Box>
                        <Box sx={{ display: { xs: "inline", sm: "none" } }}>
                            Ver carnet
                        </Box>
                    </Button>
                </Stack>
            </Box>

            <CarnetDigitalMascota
                open={openCarnet}
                onClose={() => setOpenCarnet(false)}
                vacunas={vacunas}
                mascota={mascota}
            />

            {/* Vacunas Section */}
            {vacunas.length === 0 ? (
                <Paper
                    elevation={2}
                    sx={{
                        p: 6,
                        textAlign: "center",
                        borderRadius: 3,
                        backgroundColor: "#f8f9fa",
                    }}
                >
                    <VaccinesIcon sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
                    <Typography
                        variant="h5"
                        color="text.secondary"
                        gutterBottom
                    >
                        Aún no hay vacunas registradas
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        Comenzá cargando la primera dosis para mantener el
                        control de la salud de tu mascota
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddIcon />}
                        onClick={() => setModalOpen(true)}
                        sx={{
                            backgroundColor: "#F4A261",
                            "&:hover": { backgroundColor: "#E76F51" },
                            px: 4,
                            py: 1.5,
                            fontWeight: "bold",
                        }}
                    >
                        Cargar primera vacuna
                    </Button>
                </Paper>
            ) : (
                <Box>
                    {/* Tarjetas de vacunas */}
                    <Grid container spacing={3}>
                        {Object.entries(vacunasAgrupadas).map(
                            ([nombre, lista]) => {
                                const ultimaVacuna = lista[0];
                                const aplicada = new Date(
                                    ultimaVacuna.fechaAplicacion
                                ).toLocaleDateString();
                                const proxima = ultimaVacuna.fechaProxima
                                    ? new Date(
                                          ultimaVacuna.fechaProxima
                                      ).toLocaleDateString()
                                    : ultimaVacuna.vacuna?.frecuenciaSemanas
                                      ? calcularProxima(
                                            ultimaVacuna.fechaAplicacion,
                                            ultimaVacuna.vacuna
                                                .frecuenciaSemanas
                                        )
                                      : "No registrada";

                                const estado = ultimaVacuna.fechaProxima
                                    ? new Date(ultimaVacuna.fechaProxima) >
                                      new Date()
                                        ? "Al día"
                                        : "Vencida"
                                    : ultimaVacuna.vacuna?.frecuenciaSemanas
                                      ? "Al día (estimado)"
                                      : "Sin próxima fecha";

                                const esVencida =
                                    estado.includes("Vencida") ||
                                    estado.includes("Sin próxima");

                                return (
                                    <Grid
                                        size={{ xs: 12, md: 6, lg: 4 }}
                                        key={nombre}
                                    >
                                        <Card
                                            elevation={3}
                                            sx={{
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                borderRadius: 3,
                                                border: `3px solid ${esVencida ? "#f44336" : "#4caf50"}`,
                                                transition: "all 0.3s ease",
                                                "&:hover": {
                                                    transform:
                                                        "translateY(-4px)",
                                                    boxShadow: 6,
                                                },
                                            }}
                                        >
                                            <CardContent
                                                sx={{
                                                    p: 3,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    height: "100%",
                                                }}
                                            >
                                                {/* Header de la tarjeta */}
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems:
                                                            "flex-start",
                                                        mb: 2,
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 1,
                                                        }}
                                                    >
                                                        <VaccinesIcon
                                                            sx={{
                                                                fontSize:
                                                                    "2rem",
                                                                color: esVencida
                                                                    ? "#f44336"
                                                                    : "#4caf50",
                                                            }}
                                                        />
                                                        <Box>
                                                            <Typography
                                                                variant="h6"
                                                                fontWeight="bold"
                                                            >
                                                                {nombre}
                                                            </Typography>
                                                            <Chip
                                                                label={`${lista.length} dosis`}
                                                                size="small"
                                                                color="primary"
                                                                variant="outlined"
                                                            />
                                                        </Box>
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            gap: 0.5,
                                                        }}
                                                    >
                                                        {lista.length === 1 && (
                                                            <Tooltip title="Editar dosis">
                                                                <IconButton
                                                                    size="small"
                                                                    color="primary"
                                                                    onClick={() =>
                                                                        abrirModalEditar(
                                                                            {
                                                                                ...ultimaVacuna,
                                                                                dosisNumero:
                                                                                    lista.length,
                                                                                nombreVacuna:
                                                                                    nombre,
                                                                            }
                                                                        )
                                                                    }
                                                                >
                                                                    <EditIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                        <Tooltip title="Eliminar todas las dosis de esta vacuna">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={async () => {
                                                                    // Buscar el ID de la vacuna por nombre en la lista de vacunas disponibles
                                                                    try {
                                                                        const resVacunas =
                                                                            await getVacunas();
                                                                        const vacunaEncontrada =
                                                                            resVacunas.data.find(
                                                                                (
                                                                                    v
                                                                                ) =>
                                                                                    v.nombre ===
                                                                                    nombre
                                                                            );

                                                                        if (
                                                                            !vacunaEncontrada
                                                                        ) {
                                                                            Swal.fire(
                                                                                {
                                                                                    title: "Error",
                                                                                    text: `No se encontró la vacuna "${nombre}" en el sistema`,
                                                                                    icon: "error",
                                                                                    timer: 3000,
                                                                                    showConfirmButton: false,
                                                                                }
                                                                            );
                                                                            return;
                                                                        }

                                                                        confirmarEliminacion(
                                                                            "vacuna",
                                                                            {
                                                                                vacunaId:
                                                                                    vacunaEncontrada.id,
                                                                                nombre: nombre,
                                                                            }
                                                                        );
                                                                    } catch (error) {
                                                                        console.error(
                                                                            "Error buscando vacuna:",
                                                                            error
                                                                        );
                                                                        Swal.fire(
                                                                            {
                                                                                title: "Error",
                                                                                text: "No se pudo obtener la información de la vacuna",
                                                                                icon: "error",
                                                                                timer: 3000,
                                                                                showConfirmButton: false,
                                                                            }
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </Box>

                                                <Divider sx={{ my: 2 }} />

                                                {/* Información de la última dosis */}
                                                <Box
                                                    sx={{ flexGrow: 1, mb: 2 }}
                                                >
                                                    <Typography
                                                        variant="subtitle2"
                                                        fontWeight="bold"
                                                        gutterBottom
                                                    >
                                                        Última dosis (Dosis{" "}
                                                        {lista.length})
                                                    </Typography>

                                                    <Stack spacing={1}>
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: 1,
                                                            }}
                                                        >
                                                            <CalendarTodayIcon
                                                                sx={{
                                                                    fontSize:
                                                                        "1rem",
                                                                    color: "text.secondary",
                                                                }}
                                                            />
                                                            <Typography variant="body2">
                                                                <strong>
                                                                    Aplicada:
                                                                </strong>{" "}
                                                                {aplicada}
                                                            </Typography>
                                                        </Box>

                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: 1,
                                                            }}
                                                        >
                                                            <ScheduleIcon
                                                                sx={{
                                                                    fontSize:
                                                                        "1rem",
                                                                    color: "text.secondary",
                                                                }}
                                                            />
                                                            <Typography variant="body2">
                                                                <strong>
                                                                    Próxima:
                                                                </strong>{" "}
                                                                {proxima}
                                                            </Typography>
                                                        </Box>

                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: 1,
                                                            }}
                                                        >
                                                            {esVencida ? (
                                                                <WarningIcon
                                                                    sx={{
                                                                        fontSize:
                                                                            "1rem",
                                                                        color: "#f44336",
                                                                    }}
                                                                />
                                                            ) : (
                                                                <CheckCircleIcon
                                                                    sx={{
                                                                        fontSize:
                                                                            "1rem",
                                                                        color: "#4caf50",
                                                                    }}
                                                                />
                                                            )}
                                                            <Typography variant="body2">
                                                                <strong>
                                                                    Estado:
                                                                </strong>{" "}
                                                                {estado}
                                                            </Typography>
                                                        </Box>

                                                        {ultimaVacuna.observaciones && (
                                                            <Box
                                                                sx={{
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "flex-start",
                                                                    gap: 1,
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                    sx={{
                                                                        minWidth:
                                                                            "fit-content",
                                                                    }}
                                                                >
                                                                    <strong>
                                                                        Observaciones:
                                                                    </strong>
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        fontStyle:
                                                                            "italic",
                                                                    }}
                                                                >
                                                                    {
                                                                        ultimaVacuna.observaciones
                                                                    }
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Stack>
                                                </Box>

                                                {/* Botón para ver historial - siempre en la parte inferior */}
                                                <Box sx={{ mt: "auto" }}>
                                                    {lista.length > 1 ? (
                                                        <Button
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() =>
                                                                abrirModalHistorial(
                                                                    nombre,
                                                                    lista
                                                                )
                                                            }
                                                            startIcon={
                                                                <Assignment />
                                                            }
                                                            sx={{
                                                                borderColor:
                                                                    "#F4A261",
                                                                color: "#F4A261",
                                                                "&:hover": {
                                                                    borderColor:
                                                                        "#E76F51",
                                                                    backgroundColor:
                                                                        "rgba(244, 162, 97, 0.1)",
                                                                },
                                                            }}
                                                        >
                                                            Ver historial
                                                            completo
                                                        </Button>
                                                    ) : (
                                                        <Box
                                                            sx={{
                                                                height: "40px",
                                                            }}
                                                        /> // Espacio para mantener altura consistente
                                                    )}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            }
                        )}
                    </Grid>
                </Box>
            )}

            <ModalCargarVacuna
                open={modalOpen}
                handleClose={() => setModalOpen(false)}
                idMascota={mascotaId}
                onSuccess={handleVacunaCreada}
            />

            <ModalEditarVacuna
                open={modalEditar}
                handleClose={cerrarModalEditar}
                dosis={dosisEditando}
                onSuccess={handleDosisEditada}
            />

            {/* Modal del historial de vacunas */}
            <Dialog
                open={modalHistorial}
                onClose={cerrarModalHistorial}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 2, maxHeight: "80vh" },
                }}
            >
                <DialogTitle
                    sx={{
                        backgroundColor: "#F4A261",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        py: 2,
                        px: 2,
                    }}
                >
                    <VaccinesIcon sx={{ fontSize: "1.5rem" }} />
                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            {vacunaSeleccionada?.nombre}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                            {vacunaSeleccionada?.lista?.length} dosis
                            registradas
                        </Typography>
                    </Box>
                </DialogTitle>

                <DialogContent
                    sx={{ p: 2, maxHeight: "60vh", overflow: "auto" }}
                >
                    {actualizandoHistorial && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                py: 3,
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            <CircularProgress size={40} />
                            <Typography variant="body2" color="text.secondary">
                                Actualizando historial...
                            </Typography>
                        </Box>
                    )}

                    {vacunaSeleccionada && !actualizandoHistorial && (
                        <Stack spacing={1.5} sx={{ mt: 2 }}>
                            {vacunaSeleccionada.lista.map((v, i) => {
                                const dosisNum =
                                    vacunaSeleccionada.lista.length - i;
                                const aplicada = new Date(
                                    v.fechaAplicacion
                                ).toLocaleDateString();
                                const proxima = v.fechaProxima
                                    ? new Date(
                                          v.fechaProxima
                                      ).toLocaleDateString()
                                    : v.vacuna?.frecuenciaSemanas
                                      ? calcularProxima(
                                            v.fechaAplicacion,
                                            v.vacuna.frecuenciaSemanas
                                        )
                                      : "No registrada";

                                const estado = v.fechaProxima
                                    ? new Date(v.fechaProxima) > new Date()
                                        ? "Al día"
                                        : "Vencida"
                                    : v.vacuna?.frecuenciaSemanas
                                      ? "Al día (estimado)"
                                      : "Sin próxima fecha";

                                const esVencida =
                                    estado.includes("Vencida") ||
                                    estado.includes("Sin próxima");
                                const esUltima = i === 0;

                                return (
                                    <Paper
                                        key={v.id}
                                        elevation={1}
                                        sx={{
                                            p: 2,
                                            border: `2px solid ${esVencida ? "#f44336" : "#4caf50"}`,
                                            borderRadius: 2,
                                            backgroundColor: esUltima
                                                ? "#f8f9fa"
                                                : "white",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                mb: 1.5,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}
                                            >
                                                <VaccinesIcon
                                                    sx={{
                                                        fontSize: "1.2rem",
                                                        color: esVencida
                                                            ? "#f44336"
                                                            : "#4caf50",
                                                    }}
                                                />
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight="bold"
                                                >
                                                    Dosis {dosisNum}
                                                </Typography>
                                                {esUltima && (
                                                    <Chip
                                                        label="Última"
                                                        size="small"
                                                        color="primary"
                                                        sx={{
                                                            ml: 1,
                                                            fontSize: "0.7rem",
                                                            height: "20px",
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    gap: 0.5,
                                                }}
                                            >
                                                <Tooltip title="Editar dosis">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() =>
                                                            abrirModalEditar({
                                                                ...v,
                                                                dosisNumero:
                                                                    dosisNum,
                                                                nombreVacuna:
                                                                    vacunaSeleccionada.nombre,
                                                            })
                                                        }
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Eliminar esta dosis">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() =>
                                                            confirmarEliminacion(
                                                                "dosis",
                                                                { id: v.id }
                                                            )
                                                        }
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Box>

                                        <Grid container spacing={1}>
                                            <Grid size={{ xs: 12, sm: 4 }}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 0.5,
                                                    }}
                                                >
                                                    <CalendarTodayIcon
                                                        sx={{
                                                            fontSize: "0.9rem",
                                                            color: "text.secondary",
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        Aplicada:
                                                    </Typography>
                                                </Box>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        ml: 2.5,
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {aplicada}
                                                </Typography>
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 4 }}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 0.5,
                                                    }}
                                                >
                                                    <ScheduleIcon
                                                        sx={{
                                                            fontSize: "0.9rem",
                                                            color: "text.secondary",
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        Próxima:
                                                    </Typography>
                                                </Box>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        ml: 2.5,
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {proxima}
                                                </Typography>
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 4 }}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 0.5,
                                                    }}
                                                >
                                                    {esVencida ? (
                                                        <WarningIcon
                                                            sx={{
                                                                fontSize:
                                                                    "0.9rem",
                                                                color: "#f44336",
                                                            }}
                                                        />
                                                    ) : (
                                                        <CheckCircleIcon
                                                            sx={{
                                                                fontSize:
                                                                    "0.9rem",
                                                                color: "#4caf50",
                                                            }}
                                                        />
                                                    )}
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        Estado:
                                                    </Typography>
                                                </Box>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        ml: 2.5,
                                                        color: esVencida
                                                            ? "#f44336"
                                                            : "#4caf50",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {estado}
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        {v.observaciones && (
                                            <Box
                                                sx={{
                                                    mt: 1.5,
                                                    pt: 1.5,
                                                    borderTop:
                                                        "1px solid #e0e0e0",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems:
                                                            "flex-start",
                                                        gap: 0.5,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{
                                                            minWidth:
                                                                "fit-content",
                                                        }}
                                                    >
                                                        <strong>
                                                            Observaciones:
                                                        </strong>
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontStyle: "italic",
                                                            color: "#666",
                                                        }}
                                                    >
                                                        {v.observaciones}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )}
                                    </Paper>
                                );
                            })}
                        </Stack>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2, backgroundColor: "#f8f9fa" }}>
                    <Button
                        onClick={cerrarModalHistorial}
                        variant="contained"
                        size="small"
                        sx={{
                            backgroundColor: "#F4A261",
                            "&:hover": { backgroundColor: "#E76F51" },
                            px: 3,
                            fontWeight: "bold",
                        }}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default VacunacionMascota;
