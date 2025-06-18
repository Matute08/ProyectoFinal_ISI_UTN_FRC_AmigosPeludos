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
import { getFundacion } from "../../api/fundacionesApi";
import logo from "/logo-amigos-peludos.png";
import { Box, Button, Container, Typography } from "@mui/material";
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
        width: "42%",
    },
    itemRow: {
        flexDirection: "row",
        marginBottom: 6,
    },
    value: {
        width: "58%",
    },
    subtitle: {
        fontSize: 15,
        marginBottom: 7,
        color: "#5d5d5d",
        fontWeight: "bold",
        borderBottom: "1pt solid #e0e0e0",
        paddingBottom: 4,
    },
    bigText: {
        fontSize: 13,
        marginVertical: 5,
        textAlign: "justify",
    },
    footer: {
        marginTop: 30,
        textAlign: "center",
        fontSize: 10,
        color: "#aaa",
    },
    imagenFundacion: {
        width: 100,
        height: 100,
        objectFit: "cover",
        alignSelf: "center",
        marginBottom: 10,
        borderRadius: 50,
        border: "1pt solid #ccc",
    },
     mapImage: {
        width: "100%",
        height: 200,
        borderRadius: 6,
        marginTop: 8,
    },
});

const VerSolicitudFundacion = () => {
    const { id } = useParams();
    const [solicitud, setSolicitud] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getFundacion();
            const encontrada = res.data.find(
                (f) => String(f.id) === String(id)
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

    
 

    const Doc = (
        <Document>
            <Page size="A4" style={styles.page}>
                <Image style={styles.logo} src={logo} />

                <Text style={styles.title}>Solicitud de Fundación</Text>

                {/* {solicitud?.imagen && (
          <Image style={styles.imagenFundacion} src={solicitud.imagen} />
        )} */}

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Datos de la Fundación</Text>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>ID Solicitud:</Text>
                        <Text style={styles.value}>{solicitud?.id || "-"}</Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>
                            Nombre de la Fundación:
                        </Text>
                        <Text style={styles.value}>
                            {solicitud?.nombre || "-"}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Responsable:</Text>
                        <Text style={styles.value}>
                            {solicitud?.datosUsuario?.nombreCompleto || "-"}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>CUIT:</Text>
                        <Text style={styles.value}>
                            {solicitud?.cuit || "-"}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Celular:</Text>
                        <Text style={styles.value}>
                            {solicitud?.telefono || "-"}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Dirección:</Text>
                        <Text style={styles.value}>
                            {solicitud?.direccion || "-"}{" "}
                            {solicitud?.nroCalle || ""}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Barrio:</Text>
                        <Text style={styles.value}>
                            {solicitud?.barrio || "-"}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        Información Financiera y Web
                    </Text>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>CBU:</Text>
                        <Text style={styles.value}>
                            {solicitud?.cbu || "-"}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Alias CBU:</Text>
                        <Text style={styles.value}>
                            {solicitud?.aliasCbu || "-"}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Página Web:</Text>
                        <Text style={styles.value}>
                            {solicitud?.paginaUrl || "-"}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Facebook:</Text>
                        <Text style={styles.value}>
                            {solicitud?.facebook || "-"}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Instagram:</Text>
                        <Text style={styles.value}>
                            {solicitud?.instagram || "-"}
                        </Text>
                    </View>
                </View>
            </Page>
            {/* pagina 2 */}
            <Page size="A4" style={styles.page}>
                <Image style={styles.logo} src={logo} />

                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        Descripción de la Fundación
                    </Text>
                    <Text style={styles.bigText}>
                        {solicitud?.descripcion || "-"}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Uso de Donaciones</Text>
                    <Text style={styles.bigText}>
                        {solicitud?.motivoDonaciones || "-"}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Estado</Text>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Estado de Solicitud:</Text>
                        <Text style={styles.value}>
                            {getEstadoNombre(solicitud?.estadoId)}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Fecha de Creación:</Text>
                        <Text style={styles.value}>
                            {solicitud?.fechaAlta
                                ? new Date(
                                      solicitud.fechaAlta
                                  ).toLocaleDateString("es-AR")
                                : "-"}
                        </Text>
                    </View>
                </View>
            </Page>

            {/* pagina 3 */}
            {/* <Page size="A4" style={styles.page}>
                <Image style={styles.logo} src={logo} />

                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        Descripción de la Fundación
                    </Text>
                    <Text style={styles.bigText}>
                        {solicitud?.descripcion || "-"}
                    </Text>
                </View>

                
                <Text style={styles.footer}>
                    Este PDF fue generado automáticamente por Amigos Peludos.
                </Text>
            </Page> */}
        </Document>
    );

    const handleDownload = async () => {
        const blob = await pdf(Doc).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `solicitud_fundacion_${id}.pdf`;
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
                        Información de la Fundación
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

export default VerSolicitudFundacion;
