import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Tab,
    Tabs,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Link as MuiLink,
    Divider,
    Card,
    CardContent,
    Badge,
} from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getUserMail } from "../../api/userApi";
import {
    getFormulariosDuenoPosteo,
    getFormulariosPosibleAdoptante,
    updateForm,
    getEstadosFormularios,
    getFormulariosId,
} from "../../api/formulariosApi";
import { Link } from "react-router-dom";
import CustomLoader from "../../components/CustomLoader";

const PanelFormulariosAdopcion = () => {
    const [tab, setTab] = useState(0);
    const [userData, setUserData] = useState(null);
    const [formulariosRecibidos, setFormulariosRecibidos] = useState([]);
    const [formulariosEnviados, setFormulariosEnviados] = useState([]);
    const [estados, setEstados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserData = async () => {
        try {
            const local = JSON.parse(localStorage.getItem("userData"));
            
            // Buscar email en diferentes campos posibles
            const email = local?.email || local?.mail || local?.user?.email || local?.user?.mail;
            
            if (!email) {
                return;
            }
            
            const res = await getUserMail(email);
            
            // Verificar si la respuesta tiene datos
            if (res && (res.id || res.data?.id)) {
                setUserData(res);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchFormularios = async (userId) => {
        try {
            const [recibidos, enviados] = await Promise.all([
                getFormulariosDuenoPosteo(userId),
                getFormulariosPosibleAdoptante(userId),
            ]);
            setFormulariosRecibidos(recibidos.data || []);
            setFormulariosEnviados(enviados.data || []);
        } catch (error) {
            console.error("Error fetching formularios:", error);
        }
    };

    const fetchEstados = async () => {
        const res = await getEstadosFormularios();
        setEstados(res.data);
    };


    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(null);
                await fetchUserData();
            } catch (err) {
                console.error("Error in initial load:", err);
                setError("Error al cargar los datos del usuario");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (userData?.id || userData?.data?.id) {
            const userId = userData.id || userData.data?.id;
            fetchFormularios(userId);
            fetchEstados();
        }
    }, [userData]);

    // Función para actualizar el estado localmente (actualización optimista)
    const actualizarEstadoLocal = (formularioId, nuevoEstadoId, nuevoEstadoNombre) => {
        setFormulariosRecibidos(prev => {
            // Encontrar el formulario que se está actualizando
            const formularioActualizado = prev.find(f => f.id === formularioId);
            if (!formularioActualizado) return prev;

            // Si se está aceptando un formulario, necesitamos rechazar los otros de la misma mascota
            const esAceptado = nuevoEstadoNombre === 'Aceptado';
            const mascotaId = formularioActualizado.publicacionMascotaId;
            
            // Buscar el estado "Rechazado" para los otros formularios
            const estadoRechazado = estados.find(estado => estado.nombre === 'Rechazado');
            
            return prev.map(formulario => {
                // Actualizar el formulario específico
                if (formulario.id === formularioId) {
                    return { ...formulario, estadoFormularioId: nuevoEstadoId, estadoFormulario: nuevoEstadoNombre };
                }
                
                // Si se aceptó un formulario y este es de la misma mascota, rechazarlo
                if (esAceptado && 
                    formulario.publicacionMascotaId === mascotaId && 
                    formulario.id !== formularioId &&
                    estadoRechazado) {
                    return { 
                        ...formulario, 
                        estadoFormularioId: estadoRechazado.id, 
                        estadoFormulario: estadoRechazado.nombre 
                    };
                }
                
                return formulario;
            });
        });
    };

    const handleCambiarEstado = async (formularioId) => {
        const inputOptions = estados.reduce((acc, estado) => {
            acc[estado.id] = estado.nombre;
            return acc;
        }, {});

        const { value: estadoId } = await Swal.fire({
            title: `Cambiar estado del formulario`,
            input: "select",
            inputOptions,
            inputPlaceholder: "Seleccione un estado",
            showCancelButton: true,
            confirmButtonText: "Actualizar",
            cancelButtonText: "Cancelar",
        });

        if (estadoId) {
            const estadoSeleccionado = estados.find(estado => estado.id === parseInt(estadoId));
            const nombreEstado = estadoSeleccionado?.nombre || 'Desconocido';
            
            // Actualización optimista - actualizar la UI inmediatamente
            actualizarEstadoLocal(formularioId, parseInt(estadoId), nombreEstado);

            try {
                const res = await getFormulariosId(formularioId);
                const formularioCompleto = res.data;
                formularioCompleto.estadoFormularioId = parseInt(estadoId);

                await updateForm(formularioId, formularioCompleto);

                Swal.fire({
                    title: `Estado actualizado correctamente`,
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });

            } catch (err) {
                console.error(err);
                
                // Revertir la actualización optimista en caso de error
                // Necesitamos recargar los datos para asegurar consistencia
                await fetchFormularios(userData.id || userData.data?.id);
                
                Swal.fire("Error", "No se pudo actualizar el estado.", "error");
            }
        }
    };

    const handleViewPDF = (formularioId) => {
        window.open(`/ver-formulario/${formularioId}`, "_blank");
    };

    const renderEstadoChip = (estado) => {
        const color =
            estado === "Aceptado"
                ? "success"
                : estado === "Rechazado"
                  ? "error"
                  : "warning";
        return <Chip label={estado} color={color} />;
    };

    // Función para agrupar formularios por mascota
    const agruparFormulariosPorMascota = (formularios) => {
        const grupos = {};
        
        formularios.forEach(formulario => {
            const mascotaId = formulario.publicacionMascotaId;
            if (!grupos[mascotaId]) {
                grupos[mascotaId] = {
                    mascotaId,
                    nombreMascota: formulario.nombreMascotaAdopcion || `Mascota ID: ${mascotaId}`,
                    formularios: []
                };
            }
            grupos[mascotaId].formularios.push(formulario);
        });
        
        return Object.values(grupos);
    };

    const renderTabla = (data, tipo) => {
        if (data.length === 0) {
            return (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>N°</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>
                                    {tipo === "recibidos" ? "Adoptante" : "Dueño"}
                                </TableCell>
                                <TableCell>Teléfono</TableCell>
                                <TableCell>Publicación</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No hay formularios
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            );
        }

        const gruposMascotas = agruparFormulariosPorMascota(data);

        return (
            <Box>
                {gruposMascotas.map((grupo, grupoIndex) => (
                    <Box key={grupo.mascotaId} sx={{ mb: 3 }}>
                        {/* Encabezado del grupo - Minimalista */}
                        <Box sx={{ mb: 2, pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                                {grupo.nombreMascota}
                                <Typography component="span" variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                                    ({grupo.formularios.length} {grupo.formularios.length === 1 ? 'solicitud' : 'solicitudes'})
                                </Typography>
                            </Typography>
                        </Box>

                        {/* Tabla de formularios del grupo */}
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>N°</TableCell>
                                        <TableCell>Fecha</TableCell>
                                        <TableCell>
                                            {tipo === "recibidos" ? "Adoptante" : "Dueño"}
                                        </TableCell>
                                        <TableCell>Teléfono</TableCell>
                                        <TableCell>Publicación</TableCell>
                                        <TableCell>Estado</TableCell>
                                        <TableCell align="center">Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {grupo.formularios.map((item, itemIndex) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>
                                                {new Date(
                                                    item.fechaAlta
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                {tipo === "recibidos"
                                                    ? `${item.nombre} ${item.apellido}`
                                                    : item.nombreDueño}
                                            </TableCell>
                                            <TableCell>
                                                {item.celular ? (
                                                    <MuiLink
                                                        href={`https://wa.me/${item.celular.replace(/\D/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        sx={{
                                                            cursor: 'pointer',
                                                            textDecoration: 'none',
                                                            color: 'success.main',
                                                            fontWeight: 600,
                                                            '&:hover': {
                                                                textDecoration: 'underline'
                                                            }
                                                        }}
                                                    >
                                                        {item.celular}
                                                    </MuiLink>
                                                ) : (
                                                    item.celular
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <MuiLink
                                                    component={Link}
                                                    to={`/consultar-posteo-adopcion/${item.publicacionMascotaId}`}
                                                >
                                                    Ver Mascota
                                                </MuiLink>
                                            </TableCell>
                                            <TableCell>
                                                {renderEstadoChip(item.estadoFormulario)}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: {
                                                            xs: "column",
                                                            sm: "row",
                                                        },
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        gap: 1,
                                                    }}
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() =>
                                                            handleViewPDF(item.id)
                                                        }
                                                        sx={{ minWidth: "80px" }}
                                                    >
                                                        PDF
                                                    </Button>
                                                    {tipo === "recibidos" && (
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            size="small"
                                                            onClick={() =>
                                                                handleCambiarEstado(item.id)
                                                            }
                                                            sx={{ minWidth: "80px" }}
                                                        >
                                                            Estado
                                                        </Button>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Espaciado entre grupos */}
                        {grupoIndex < gruposMascotas.length - 1 && (
                            <Box sx={{ mt: 4 }} />
                        )}
                    </Box>
                ))}
            </Box>
        );
    };

    if (loading) {
        return (
            <Container sx={{ textAlign: "center", mt: 5 }}>
                <CustomLoader />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ textAlign: "center", mt: 5 }}>
                <Typography variant="h6" color="error" gutterBottom>
                    {error}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Por favor, verifica que estés logueado correctamente.
                </Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Formularios de Adopción
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs
                    value={tab}
                    onChange={(_, newVal) => setTab(newVal)}
                    centered
                >
                    <Tab label="Recibidos" />
                    <Tab label="Enviados" />
                </Tabs>
            </Box>
            {tab === 0 && renderTabla(formulariosRecibidos, "recibidos")}
            {tab === 1 && renderTabla(formulariosEnviados, "enviados")}
        </Container>
    );
};

export default PanelFormulariosAdopcion;
