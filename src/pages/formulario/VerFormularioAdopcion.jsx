import React, { useState, useEffect } from "react";
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
import { getFormulariosId } from "../../api/formulariosApi";
import { getDetallePublicacion } from "../../api/publicacionesApi";
import logo from "/logo-amigos-peludos.png";
import { Button, Container, Box, Typography } from "@mui/material";

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Helvetica",
        fontSize: 12,
        lineHeight: 1.5,
        backgroundColor: "#fefefe",
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
        color: "#333",
    },
    section: {
        marginBottom: 12,
        padding: 10,
        border: "1pt solid #ccc",
        borderRadius: 4,
    },
    label: {
        fontWeight: "bold",
        width: "40%",
    },
    itemRow: {
        flexDirection: "row",
        marginBottom: 4,
    },
    value: {
        width: "60%",
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 6,
        color: "#444",
        fontWeight: "bold",
        borderBottom: "1pt solid #ddd",
        paddingBottom: 3,
    },
    footer: {
        marginTop: 20,
        textAlign: "center",
        fontSize: 10,
        color: "#999",
    },
    petImage: {
        width: "100%",
        height: 300,
        objectFit: "cover",
        marginBottom: 10,
    },
});

const VerFormularioAdopcion = () => {
    const { id } = useParams();
    const [formulario, setFormulario] = useState(null);
    const [mascota, setMascota] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getFormulariosId(id);
            setFormulario(res.data);
            if (res.data.publicacionMascotaId) {
                const mascotaRes = await getDetallePublicacion(
                    res.data.publicacionMascotaId
                );
                setMascota(mascotaRes);
            }
        };
        fetchData();
    }, [id]);

    const formatBool = (v) => (v ? "Sí" : "No");
    const formatDate = (fecha) => new Date(fecha).toLocaleDateString("es-AR");

    const FormDoc = (
        <Document>
            {/* Página 1 */}
            <Page size="A4" style={styles.page}>
                <Image style={styles.logo} src={logo} />
                <Text style={styles.title}>Formulario de Adopción</Text>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        Información del Solicitante
                    </Text>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Nombre Completo:</Text>
                        <Text style={styles.value}>
                            {formulario?.nombre} {formulario?.apellido}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>DNI:</Text>
                        <Text style={styles.value}>{formulario?.dni}</Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Celular:</Text>
                        <Text style={styles.value}>{formulario?.celular}</Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Ciudad:</Text>
                        <Text style={styles.value}>
                            {formulario?.ciudadFormulario}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Barrio:</Text>
                        <Text style={styles.value}>
                            {formulario?.barrioFormulario}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Dirección:</Text>
                        <Text style={styles.value}>
                            {formulario?.calle} {formulario?.nroCalle}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Condiciones del Hogar</Text>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Tipo de Vivienda:</Text>
                        <Text style={styles.value}>
                            {formulario?.tipoVivienda}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>¿Inquilino?:</Text>
                        <Text style={styles.value}>
                            {formatBool(formulario?.estadoResidencia)}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>¿Aceptan Mascotas?:</Text>
                        <Text style={styles.value}>
                            {formatBool(formulario?.aceptaMascota)}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>¿Tiene cerramiento?:</Text>
                        <Text style={styles.value}>
                            {formatBool(formulario?.viviendaCerrada)}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>¿Otras Mascotas?:</Text>
                        <Text style={styles.value}>
                            {formulario?.otrasMascotas}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Estado del Formulario</Text>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Estado:</Text>
                        <Text style={styles.value}>
                            {formulario?.estadoFormulario}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Fecha de Creación:</Text>
                        <Text style={styles.value}>
                            {formatDate(formulario?.fechaAlta)}
                        </Text>
                    </View>
                </View>

                <Text style={styles.footer}>
                    Este formulario fue generado automáticamente por el sistema
                    Amigos Peludos.
                </Text>
            </Page>

            {/* Página 2: Datos de la Mascota */}
            {mascota && (
                <Page size="A4" style={styles.page}>
                    <Image style={styles.logo} src={logo} />
                    <Text style={styles.title}>Mascota Asociada</Text>

                    {/* {mascota.foto && (
                        <Image style={styles.petImage} src={mascota.fotos[0].foto} />
                    )} */}

                    <View style={styles.section}>
                        <Text style={styles.subtitle}>Datos Generales</Text>
                        <View style={styles.itemRow}>
                            <Text style={styles.label}>Nombre:</Text>
                            <Text style={styles.value}>{mascota.nombre}</Text>
                        </View>
                        <View style={styles.itemRow}>
                            <Text style={styles.label}>Tipo:</Text>
                            <Text style={styles.value}>
                                {mascota.tipoMascotaNombre}
                            </Text>
                        </View>
                        <View style={styles.itemRow}>
                            <Text style={styles.label}>Edad:</Text>
                            <Text style={styles.value}>
                                {mascota.edadMascota}
                            </Text>
                        </View>
                        <View style={styles.itemRow}>
                            <Text style={styles.label}>Sexo:</Text>
                            <Text style={styles.value}>
                                {mascota.sexoMascota}
                            </Text>
                        </View>
                        <View style={styles.itemRow}>
                            <Text style={styles.label}>Descripción:</Text>
                            <Text style={styles.value}>
                                {mascota.descripcion}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.footer}>
                        Información extraída de la publicación de adopción.
                    </Text>
                </Page>
            )}
        </Document>
    );

    const handleDownload = async () => {
        const blob = await pdf(FormDoc).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `formulario_adopcion_${id}.pdf`;
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
                        Formulario de Adopción
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        mb: 2,
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
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
                    {formulario && (
                        <PDFViewer width="100%" height="100%">
                            {FormDoc}
                        </PDFViewer>
                    )}
                </Box>
            </Container>
        </>
    );
};

export default VerFormularioAdopcion;
