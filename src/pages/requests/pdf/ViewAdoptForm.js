import React, { useState, useEffect } from "react";
import {
    PDFViewer,
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import logo from "../../../assets/images/logo/LogoAP.png";

import { getFormulariosId } from "../../../services/api";

const styles = StyleSheet.create({
    container: {
        padding: 20,
        fontFamily: "Helvetica",
    },
    image: {
        width: "15%",
        display: "flex",
        justifyContent: "end",
        alignSelf: "flex-end",
        position: "absolute",
        top: 0,
        right: 0,
    },
    title: {
        textAlign: "center",
        fontSize: 30,
        margin: 20,
        fontWeight: "bold",
    },
    label: {
        fontWeight: "bold",
        marginBottom: 20,
        marginRight: 10
    },
    item: {
        marginBottom: 10,
        width: "100%",
        display: "flex",
        flexDirection: "row",  // Cambio aquí
        //justifyContent: "space-between",  // Añadido para espacio entre etiquetas y valores
    },
    containerDiv: {
        height: "100vh",
    },
});

const ViewAdoptForm = () => {
    const { id } = useParams();
    const [dataForm, setDataForm] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchForm = async () => {
            console.log(id);
            if (id) {
                const data = await getFormulariosId(id);
                setDataForm(data);
                setIsLoading(false);
            }
            console.log(dataForm);
        };

        if (id) {
            fetchForm();
        }
    }, [id]);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Los meses son indexados desde 0
        const year = date.getFullYear();
        return `${day < 10 ? "0" : ""}${day}/${
            month < 10 ? "0" : ""
        }${month}/${year}`;
    };

    return (
        <div style={styles.containerDiv}>
            {dataForm && (
                <PDFViewer width="100%" height="100%">
                    <Document>
                        <Page style={styles.container}>
                            <View>
                                <Text style={styles.title}>
                                    Formulario de Adopción
                                </Text>
                                <Image style={styles.image} src={logo} />

                                <View style={styles.item}>
                                    <Text style={styles.label}>
                                        Nombre Completo del Solicitante:
                                    </Text>
                                    <Text>
                                        {dataForm
                                            ? `${dataForm.nombre} ${dataForm.apellido}`
                                            : ""}
                                    </Text>
                                </View>

                                <View style={styles.item}>
                                    <Text style={styles.label}>DNI:</Text>
                                    <Text>{dataForm ? dataForm.dni : ""}</Text>
                                </View>

                                <View style={styles.item}>
                                    <Text style={styles.label}>Celular:</Text>
                                    <Text>
                                        {dataForm ? dataForm.celular : ""}
                                    </Text>
                                </View>

                                <View style={styles.item}>
                                    <Text style={styles.label}>Ciudad:</Text>
                                    <Text>{dataForm ? "Cordoba" : ""}</Text>
                                </View>

                                <View style={styles.item}>
                                    <Text style={styles.label}>Barrio:</Text>
                                    <Text>
                                        {dataForm ? dataForm.barrioFormulario : ""}
                                    </Text>
                                </View>

                                <View style={styles.item}>
                                    <Text style={styles.label}>Dirección:</Text>
                                    <Text>
                                        {dataForm
                                            ? `${dataForm.calle} ${dataForm.nroCalle}`
                                            : ""}
                                    </Text>
                                </View>

                                <View style={styles.item}>
                                    <Text style={styles.label}>
                                        Tipo Vivienda:
                                    </Text>
                                    <Text>
                                        {dataForm ? dataForm.tipoVivienda : ""}
                                    </Text>
                                </View>

                                <View style={styles.item}>
                                    <Text style={styles.label}>
                                        ¿Propietario o Inquilino?:
                                    </Text>
                                    <Text>
                                        {dataForm
                                            ? dataForm.estadoResidencia
                                                ? "Inquilino"
                                                : "Propietario"
                                            : ""}
                                    </Text>
                                </View>

                                <View style={styles.item}>
                                    <Text style={styles.label}>
                                        ¿Aceptan Mascotas?:
                                    </Text>
                                    <Text>
                                        {dataForm
                                            ? dataForm.aceptaMascota
                                                ? "Si"
                                                : "No"
                                            : ""}
                                    </Text>
                                </View>

                                <View style={styles.item}>
                                    <Text style={styles.label}>
                                        ¿Cerramiento?:
                                    </Text>
                                    <Text>
                                        {dataForm
                                            ? dataForm.viviendaCerrada
                                                ? "Si"
                                                : "No"
                                            : ""}
                                    </Text>
                                </View>

                                <View style={styles.item}>
                                    <Text style={styles.label}>
                                        ¿Otras Mascotas?:
                                    </Text>
                                    <Text>
                                        {dataForm ? dataForm.otrasMascotas : ""}
                                    </Text>
                                </View>

                                <View style={styles.item}>
                                    <Text style={styles.label}>
                                        Estado Adopción:
                                    </Text>
                                    <Text>
                                        {dataForm
                                            ? dataForm.estadoFormulario
                                            : ""}
                                    </Text>
                                </View>

                                <View style={styles.item}>
                                    <Text style={styles.label}>
                                        Fecha de Creación:
                                    </Text>
                                    <Text>
                                        {dataForm
                                            ? formatDate(dataForm.fechaAlta)
                                            : ""}
                                    </Text>
                                </View>
                            </View>
                        </Page>
                    </Document>
                </PDFViewer>
            )}
        </div>
    );
};

export default ViewAdoptForm;
