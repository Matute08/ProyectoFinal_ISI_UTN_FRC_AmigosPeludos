import React, { useEffect, useState } from "react";
import {
    PDFViewer,
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    pdf,
} from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import { getVeterinarias } from "../../api/commonApi";
import logo from "/logo-amigos-peludos.png";
import { Button, Container, Box, Typography } from "@mui/material";

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Helvetica",
        fontSize: 13,
        lineHeight: 1.5,
        backgroundColor: "#fff",
    },
    logo: {
        width: 80,
        alignSelf: "flex-end",
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: 16,
        fontWeight: "bold",
        textTransform: "uppercase",
        color: "#3e3e3e",
    },
    section: {
        marginBottom: 16,
        padding: 12,
        border: "1pt solid #ccc",
        borderRadius: 6,
        backgroundColor: "#fafafa",
    },
    label: {
        fontWeight: "bold",
        width: "40%",
    },
    itemRow: {
        flexDirection: "row",
        marginBottom: 6,
    },
    value: {
        width: "60%",
    },
    subtitle: {
        fontSize: 15,
        marginBottom: 7,
        color: "#5d5d5d",
        fontWeight: "bold",
        borderBottom: "1pt solid #e0e0e0",
        paddingBottom: 4,
    },
    table: {
        display: "table",
        width: "auto",
        marginVertical: 10,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableHeader: {
        backgroundColor: "#eee",
    },
    tableCell: {
        padding: 5,
        fontSize: 12,
        borderRight: "1pt solid #ccc",
        borderBottom: "1pt solid #ccc",
        width: "33%",
    },
    tableCellService: {
        padding: 5,
        fontSize: 12,
        borderRight: "1pt solid #ccc",
        borderBottom: "1pt solid #ccc",
        width: "50%",
    },
    footer: {
        marginTop: 30,
        textAlign: "center",
        fontSize: 10,
        color: "#aaa",
    },
});

const DIAS = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
];

const NOMBRES_SERVICIOS = {
    castraciones: "Castraciones",
    ecografias: "Ecografías",
    emergencias: "Emergencias",
    equipoLaboratorio: "Equipo de Laboratorio",
    guardia24hs: "Guardia 24hs",
    internaciones: "Internaciones",
    observaciones: "Observaciones",
    otros: "Otros",
    radiografias: "Radiografías",
    vacunaciones: "Vacunaciones",
};

const VerSolicitudVeterinaria = () => {
    const { id } = useParams();
    const [solicitud, setSolicitud] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getVeterinarias();
            const encontrada = res.data.find(
                (v) => String(v.id) === String(id)
            );
            setSolicitud(encontrada);
        };
        fetchData();
    }, [id]);

    const getEstadoNombre = (id) => {
        if (id === 1) return "Revisión";
        if (id === 2) return "Aceptado";
        if (id === 3) return "Rechazado";
        return "Desconocido";
    };
    // Horarios: mostrar como tabla día/horario
    const renderHorarios = (horarios = {}) => {
        const diasConAtencion = DIAS.filter(
            (dia) => horarios[dia] && horarios[dia].trim() !== ""
        );
        const diasSinAtencion = DIAS.filter(
            (dia) => !horarios[dia] || horarios[dia].trim() === ""
        );

        if (diasConAtencion.length === 0) {
            return <Text>No se especificaron horarios de atención.</Text>;
        }

        return (
            <View>
                {diasConAtencion.map((dia) => (
                    <View
                        key={dia}
                        style={{
                            flexDirection: "row",
                            marginBottom: 6,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ fontSize: 16, marginRight: 6 }}></Text>
                        <Text style={{ fontWeight: "bold", minWidth: 90 }}>
                            {dia.charAt(0).toUpperCase() + dia.slice(1)}:
                        </Text>
                        <Text style={{ marginLeft: 4 }}>{horarios[dia]}</Text>
                    </View>
                ))}
                {diasSinAtencion.length > 0 && (
                    <View style={{ marginTop: 8 }}>
                        {diasSinAtencion.map((dia) => (
                            <View
                                key={dia}
                                style={{
                                    flexDirection: "row",
                                    marginBottom: 2,
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        marginRight: 6,
                                        color: "#bbb",
                                    }}
                                ></Text>
                                <Text style={{ color: "#888" }}>
                                    {dia.charAt(0).toUpperCase() + dia.slice(1)}
                                    :{" "}
                                    <Text style={{ fontStyle: "italic" }}>
                                        Sin atención
                                    </Text>
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    // Servicios: mostrar solo los que son true
    const renderServicios = (servicios = {}) => {
        // Los booleanos
        const lista = Object.entries(NOMBRES_SERVICIOS)
            .filter(([key]) => key !== "otros")
            .map(([key, nombre]) => ({
                key,
                nombre,
                activo: servicios[key] === true,
            }));

        // El campo otros (string)
        const hayOtros =
            servicios.otros &&
            typeof servicios.otros === "string" &&
            servicios.otros.trim() !== "";

        return (
            <View
                style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 6,
                    marginTop: 2,
                    marginLeft: 0,
                    marginBottom: 4,
                }}
            >
                {lista.map((item) => (
                    <View
                        key={item.key}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            borderRadius: 10,
                            paddingVertical: 2,
                            paddingHorizontal: 10,
                            marginRight: 6,
                            marginBottom: 6,
                            backgroundColor: item.activo
                                ? "#e0f7e9"
                                : "#f0f0f0",
                            border: item.activo
                                ? "1pt solid #2e7d32"
                                : "1pt solid #ccc",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 13,
                                color: item.activo ? "#2e7d32" : "#bbb",
                                marginRight: 5,
                                textDecoration: item.activo
                                    ? "none"
                                    : "line-through",
                            }}
                        >
                            {item.nombre}
                        </Text>
                    </View>
                ))}

                {hayOtros && (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            borderRadius: 10,
                            paddingVertical: 2,
                            paddingHorizontal: 10,
                            marginRight: 6,
                            marginBottom: 6,
                            backgroundColor: "#e0f7e9",
                            border: "1pt solid #2e7d32",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 13,
                                color: "#2e7d32",
                                fontWeight: "bold",
                                marginRight: 5,
                            }}
                        >
                            Otros:
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                color: "#2e7d32",
                            }}
                        >
                            {servicios.otros}
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    const Doc = (
        <Document>
            <Page size="A4" style={styles.page}>
                <Image style={styles.logo} src={logo} />
                <Text style={styles.title}>Solicitud de Veterinaria</Text>
                <View style={styles.section}>
                    <Text style={styles.subtitle}>Datos Generales</Text>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Nombre:</Text>
                        <Text style={styles.value}>
                            {solicitud?.nombre || "-"}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>CUIT/CUIL:</Text>
                        <Text style={styles.value}>
                            {solicitud?.cuil || "-"}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Teléfono:</Text>
                        <Text style={styles.value}>
                            {solicitud?.numeroTelefono || "-"}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Dirección:</Text>
                        <Text style={styles.value}>
                            {solicitud?.direccion || "-"}{" "}
                            {solicitud?.numeroCalle || ""}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Barrio:</Text>
                        <Text style={styles.value}>
                            {solicitud?.barrio || "-"}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Responsable:</Text>
                        <Text style={styles.value}>
                            {solicitud?.datosUsuario?.nombreCompleto || "-"}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Fecha de solicitud:</Text>
                        <Text style={styles.value}>
                            {solicitud?.fechaAlta
                                ? new Date(
                                      solicitud.fechaAlta
                                  ).toLocaleDateString("es-AR")
                                : "-"}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Horarios de Atención</Text>
                    {renderHorarios(solicitud?.horarios)}
                </View>
            </Page>

            {/* Pagina 2 */}
            <Page size="A4" style={styles.page}>
                <Image style={styles.logo} src={logo} />
                <View style={styles.section}>
                    <Text style={styles.subtitle}>Servicios que brinda</Text>
                    {renderServicios(solicitud?.servicios)}
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        Redes y Datos Donaciones
                    </Text>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>CBU:</Text>
                        <Text style={styles.value}>{solicitud?.cbu}</Text>
                    </View>

                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Alias CBU:</Text>
                        <Text style={styles.value}>{solicitud?.aliasCBU}</Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>
                            Descripción de Donacion:
                        </Text>
                        <Text style={styles.value}>
                            {solicitud?.descripcion}
                        </Text>
                    </View>

                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Pagina Web:</Text>
                        <Text style={styles.value}>{solicitud?.paginaWeb}</Text>
                    </View>

                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Instagram:</Text>
                        <Text style={styles.value}>
                            {solicitud?.instagramUrl}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Facebook:</Text>
                        <Text style={styles.value}>
                            {solicitud?.facebookUrl}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Estado</Text>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Estado de Solicitud:</Text>
                        <Text style={styles.value}>
                            {getEstadoNombre(solicitud?.estadoId)}
                        </Text>
                    </View>
                </View>
                <Text style={styles.footer}>
                    Este PDF fue generado automáticamente por Amigos Peludos.
                </Text>
            </Page>
        </Document>
    );

    const handleDownload = async () => {
        const blob = await pdf(Doc).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `solicitud_veterinaria_${id}.pdf`;
        link.click();
    };

    return (
        <>
            <Container
                maxWidth="md"
                sx={{
                    mt: 4,
                    mb: 4,
                    backgroundColor: "#e0d0b8",
                    borderRadius: 4,
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "primary.main",
                        p: 2,
                        borderRadius: 2,
                        textAlign: "center",
                        boxShadow: 2,
                        mb: 4,
                    }}
                >
                    <Typography variant="h5" color="primary.contrastText">
                        Información de la Veterinaria
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    sx={{
                        mb: 2,
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                    color="primary"
                    onClick={handleDownload}
                >
                    Descargar PDF
                </Button>
                <Box
                    style={{
                        height: "100vh",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    {solicitud && (
                        <PDFViewer
                            width="100%"
                            height="100%"
                            style={{
                                border: "none",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            {Doc}
                        </PDFViewer>
                    )}
                </Box>
            </Container>
        </>
    );
};

export default VerSolicitudVeterinaria;
