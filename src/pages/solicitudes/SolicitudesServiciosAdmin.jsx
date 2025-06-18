import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Tabs,
    Tab,
    Box,
    Badge,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Chip,
    CircularProgress,
} from "@mui/material";
import Swal from "sweetalert2";
import { useAuth } from "../../auth/AuthProvider";
import { getUserMail } from "../../api/userApi";
import {
    getVeterinarias,
    updateEstadoVeterinaria,

} from "../../api/commonApi";
import {
    getFundacion,
    updateEstadoFundacion,
} from "../../api/fundacionesApi";
// Si después hacés los endpoints "pendientes" reales, los usás acá
import { useNavigate } from "react-router-dom";

const estados = [
    { id: 1, nombre: "Revisión", color: "warning" },
    { id: 2, nombre: "Aceptado", color: "success" },
    { id: 3, nombre: "Rechazado", color: "error" },
];

const getEstadoObj = (id) =>
    estados.find((e) => e.id === id) || {
        nombre: "Desconocido",
        color: "default",
    };

const columnsVeterinaria = [
    { label: "N° Solicitud", accessor: "id" },
    {
        label: "Fecha",
        accessor: "fechaAlta",
        format: (v) => new Date(v).toLocaleDateString("es-AR"),
    },
    { label: "Nombre", accessor: "nombre" },
    { label: "Teléfono", accessor: "numeroTelefono" },
    { label: "Dirección", accessor: "direccion" },
    { label: "Altura", accessor: "numeroCalle" },
    { label: "CUIT/CUIL", accessor: "cuil" },
    {
        label: "Estado",
        accessor: "estadoId",
        render: (id) => {
            const e = getEstadoObj(id);
            return <Chip label={e.nombre} color={e.color} size="small" />;
        },
    },
];

const columnsFundacion = [
    { label: "N° Solicitud", accessor: "id" },
    {
        label: "Fecha",
        accessor: "fechaAlta",
        format: (v) => new Date(v).toLocaleDateString("es-AR"),
    },
    { label: "Nombre Fundación", accessor: "nombre" },
    { label: "Teléfono", accessor: "telefono" },
    { label: "Dirección", accessor: "direccion" },
    { label: "Altura", accessor: "nroCalle" },
    { label: "CUIT", accessor: "cuit" },
    {
        label: "Estado",
        accessor: "estadoId",
        render: (id) => {
            const e = getEstadoObj(id);
            return <Chip label={e.nombre} color={e.color} size="small" />;
        },
    },
];

const TablaSolicitudes = ({
    rows,
    columns,
    isLoading,
    onCambiarEstado,
    onVerPDF,
}) => (
    <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    {columns.map((col) => (
                        <TableCell key={col.label}>{col.label}</TableCell>
                    ))}
                    <TableCell align="center">Acciones</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={columns.length + 1} align="center">
                            <CircularProgress size={28} />
                        </TableCell>
                    </TableRow>
                ) : rows.length ? (
                    rows.map((row) => (
                        <TableRow key={row.id}>
                            {columns.map((col) => (
                                <TableCell key={col.label}>
                                    {col.render
                                        ? col.render(row[col.accessor], row)
                                        : col.format
                                          ? col.format(row[col.accessor])
                                          : row[col.accessor]}
                                </TableCell>
                            ))}
                            <TableCell align="center">
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: {
                                            xs: "column",
                                            sm: "row",
                                        },
                                        gap: 1,
                                        justifyContent: "center",
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => onVerPDF(row.id)}
                                    >
                                        PDF
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        color="primary"
                                        onClick={() => onCambiarEstado(row)}
                                    >
                                        Estado
                                    </Button>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={columns.length + 1} align="center">
                            No hay solicitudes.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </TableContainer>
);

const SolicitudesServiciosAdmin = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [tab, setTab] = useState(0);

    const [veterinarias, setVeterinarias] = useState([]);
    const [fundaciones, setFundaciones] = useState([]);
    const [loadingVete, setLoadingVete] = useState(true);
    const [loadingFunda, setLoadingFunda] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const local = JSON.parse(localStorage.getItem("userData"));
            if (local?.email) {
                const res = await getUserMail(local.email);
                setUserData(res);
            }
        };
        fetchUserData();
    }, [user?.email]);

    useEffect(() => {
        if (!userData?.rolId || userData.rolId !== 1) return;

        const fetchVete = async () => {
            setLoadingVete(true);
            const res = await getVeterinarias();
            setVeterinarias(res.data || []);
            setLoadingVete(false);
        };

        const fetchFunda = async () => {
            setLoadingFunda(true);
            const res = await getFundacion();
            setFundaciones(res.data || []);
            setLoadingFunda(false);
        };

        fetchVete();
        fetchFunda();
    }, [userData]);

    const handleCambiarEstado = async (row, tipo) => {
        const inputOptions = estados.reduce((acc, e) => {
            acc[e.id] = e.nombre;
            return acc;
        }, {});
        const { value: estadoId } = await Swal.fire({
            title: `Cambiar estado de ${row.nombre}`,
            input: "select",
            inputOptions,
            inputPlaceholder: "Seleccione estado",
            showCancelButton: true,
            confirmButtonText: "Actualizar",
        });

        if (estadoId) {
            try {
                if (tipo === "vete") {
                    await updateEstadoVeterinaria(row.id, {
                        ...row,
                        estadoId: Number(estadoId),
                    });
                } else {
                    await updateEstadoFundacion(row.id, {
                        ...row,
                        estadoId: Number(estadoId),
                    });
                }
                Swal.fire({
                    title: "Estado actualizado",
                    icon: "success",
                    html: "Actualizando vista en <b></b> segundos...",
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    didOpen: () => {
                        const b = Swal.getHtmlContainer().querySelector("b");
                        const timerInterval = setInterval(() => {
                            b.textContent = (
                                Swal.getTimerLeft() / 1000
                            ).toFixed(1);
                        }, 100);
                    },
                    willClose: () => window.location.reload(),
                });
            } catch {
                Swal.fire("Error", "No se pudo actualizar el estado.", "error");
            }
        }
    };

    const handleVerPDF = (id, tipo) => {
        if (tipo === "vete") {
            window.open(`/ver-solicitud-veterinaria/${id} `, "_blank");
            //navigate(`/ver-solicitud-veterinaria/${id} `, "_blank" );
        } else {
            window.open(`/ver-solicitud-fundacion/${id}`, "_blank");

            //navigate(`/ver-solicitud-fundacion/${id}` ,"_blank");
        }
    };

    // Badges de pendientes
    const notificacionesVete = veterinarias.filter(
        (v) => v.estadoId === 1
    ).length;
    const notificacionesFunda = fundaciones.filter(
        (f) => f.estadoId === 1
    ).length;

    // Sólo admins pueden ver este panel
    if (!userData || userData.rolId !== 1)
        return (
            <Container sx={{ mt: 8 }}>
                <Typography variant="h5" color="error" align="center">
                    Acceso solo para administradores.
                </Typography>
            </Container>
        );

    return (
        // TABLA
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Solicitudes de Servicios
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
                    <Tab
                        label={
                            <Badge
                                color="warning"
                                badgeContent={notificacionesVete}
                                sx={{ p: 1 }}
                            >
                                Veterinarias
                            </Badge>
                        }
                    />
                    <Tab
                        label={
                            <Badge
                                color="warning"
                                badgeContent={notificacionesFunda}
                                sx={{ p: 1 }}
                            >
                                Fundaciones
                            </Badge>
                        }
                    />
                </Tabs>
            </Box>
            {tab === 0 && (
                <TablaSolicitudes
                    rows={veterinarias}
                    columns={columnsVeterinaria}
                    isLoading={loadingVete}
                    onCambiarEstado={(row) => handleCambiarEstado(row, "vete")}
                    onVerPDF={(id) => handleVerPDF(id, "vete")}
                />
            )}
            {tab === 1 && (
                <TablaSolicitudes
                    rows={fundaciones}
                    columns={columnsFundacion}
                    isLoading={loadingFunda}
                    onCambiarEstado={(row) => handleCambiarEstado(row, "funda")}
                    onVerPDF={(id) => handleVerPDF(id, "funda")}
                />
            )}
        </Container>
    );
};

export default SolicitudesServiciosAdmin;
