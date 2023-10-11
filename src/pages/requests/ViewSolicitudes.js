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
import logo from "../../assets/images/logo/LogoAP.png";
import { getFormulariosId, getVeterinariaId } from "../../services/api";

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
        marginRight: 10,
        fontSize: 18,
    },
    item: {
        marginBottom: 10,
        fontSize: 17,
        width: "100%",
        display: "flex",
        flexDirection: "row", // Cambio aquí
        //justifyContent: "space-between",  // Añadido para espacio entre etiquetas y valores
    },
    day: {
       
        fontWeight: "bold",
        marginBottom: 20,
        marginRight: 10,
        fontSize: 18,
    },
    containerDiv: {
        height: "100vh",
    },
    subTitle: {
        fontSize: 30,
        margin: 20,

    },
});

const ViewSolicitudes = () => {
    const { id } = useParams();
    const [dataForm, setDataForm] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchForm = async () => {
            console.log(id);
            if (id) {
                const data = await getVeterinariaId(id);
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
                                    Solicitud de Servicio
                                </Text>
                                <Image style={styles.image} src={logo} />

                                <View style={styles.item}>
                                    <Text style={styles.label}>
                                        ID Solicitud:
                                    </Text>
                                    <Text>
                                        {dataForm ? `${dataForm.id}` : ""}
                                    </Text>
                                </View>

                                <View style={styles.item}>
                                    <Text style={styles.label}>
                                        Nombre de la Veterinaria:
                                    </Text>
                                    <Text>
                                        {dataForm ? `${dataForm.nombre}` : ""}
                                    </Text>
                                </View>

                                <View style={styles.item}>
                                    <Text style={styles.label}>
                                        Nombre del Dueño:
                                    </Text>
                                    <Text>
                                        {dataForm && dataForm.datosUsuario ? `${dataForm.datosUsuario.nombreCompleto}` : ""}
                                    </Text>
                                </View>

                                <View style={styles.item}>
                                    <Text style={styles.label}>CUIT:</Text>
                                    <Text>{dataForm ? dataForm.cuil : ""}</Text>
                                </View>

                                <View style={styles.item}>
                                    <Text style={styles.label}>Celular:</Text>
                                    <Text>
                                        {dataForm
                                            ? dataForm.numeroTelefono
                                            : ""}
                                    </Text>
                                </View>

                                <View style={styles.item}>
                                    <Text style={styles.label}>Dirección:</Text>
                                    <Text>
                                        {dataForm
                                            ? `${dataForm.direccion} ${dataForm.numeroCalle}`
                                            : ""}
                                    </Text>
                                </View>

                                <View style={styles.item}>
                                    <Text style={styles.label}>Barrio:</Text>
                                    <Text>
                                        {dataForm ? dataForm.barrio : ""}
                                    </Text>
                                </View>

                                <View style={styles.item}>
                                    <Text style={styles.label}>CBU:</Text>
                                    <Text>
                                        {dataForm
                                            ? dataForm.cbu
                                            : "No recibe donaciones"}
                                    </Text>
                                </View>
                                {/* hroarios */}
                                <View style={styles.item}>
                                    <Text style={styles.subTitle}>
                                        Horarios de Atención:
                                    </Text>
                                </View>
                                <View style={styles.item}>
                                    <View style={styles.day}>
                                        <Text>
                                            Lunes:{" "}
                                            {dataForm.horarios?.lunes ||
                                                "Cerrado"}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.item}>
                                    <View style={styles.day}>
                                        <Text>
                                            Martes:{" "}
                                            {dataForm.horarios?.martes ||
                                                "Cerrado"}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.item}>
                                    <View style={styles.day}>
                                        <Text>
                                            Miércoles:{" "}
                                            {dataForm.horarios?.miercoles ||
                                                "Cerrado"}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.item}>
                                    <View style={styles.day}>
                                        <Text>
                                            Jueves:{" "}
                                            {dataForm.horarios?.jueves ||
                                                "Cerrado"}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.item}>
                                    <View style={styles.day}>
                                        <Text>
                                            Viernes:{" "}
                                            {dataForm.horarios?.viernes ||
                                                "Cerrado"}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.item}>
                                    <View style={styles.day}>
                                        <Text>
                                            Sábado:{" "}
                                            {dataForm.horarios?.sabado ||
                                                "Cerrado"}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.item}>
                                    <View style={styles.day}>
                                        <Text>
                                            Domingo:{" "}
                                            {dataForm.horarios?.domingo ||
                                                "Cerrado"}
                                        </Text>
                                    </View>
                                </View>

                                {/* Servicios */}
                                <View style={styles.item}>
                                    <Text style={styles.subTitle}>
                                        Servicios que Ofrece:
                                    </Text>
                                </View>
                                <View style={styles.day}>
                                    <Text>
                                        Castraciones:{" "}
                                        {dataForm.servicios.castraciones
                                            ? "Si"
                                            : "No"}
                                    </Text>
                                </View>

                                <View style={styles.day}>
                                    <View style={styles.day}>
                                        <Text>
                                            Internaciones:{" "}
                                            {dataForm.servicios.internaciones
                                                ? "Si"
                                                : "No"}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.day}>
                                    <View style={styles.day}>
                                        <Text>
                                            Vacunaciones:{" "}
                                            {dataForm.servicios.vacunaciones
                                                ? "Si"
                                                : "No"}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.day}>
                                    <View style={styles.day}>
                                        <Text>
                                            Equipos para extracción:{" "}
                                            {dataForm.servicios
                                                .equipoLaboratorio
                                                ? "Si"
                                                : "No"}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.day}>
                                    <View style={styles.day}>
                                        <Text>
                                            Radiografias:{" "}
                                            {dataForm.servicios.radiografias
                                                ? "Si"
                                                : "No"}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.day}>
                                    <View style={styles.day}>
                                        <Text>
                                            Ecografias:{" "}
                                            {dataForm.servicios.ecografias
                                                ? "Si"
                                                : "No"}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.day}>
                                    <View style={styles.day}>
                                        <Text>
                                            Guardias 24hs:{" "}
                                            {dataForm.servicios.guardia24hs
                                                ? "Si"
                                                : "No"}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.day}>
                                    <View style={styles.day}>
                                        <Text>
                                            Emergencias a Domicilio:{" "}
                                            {dataForm.servicios.emergencias
                                                ? "Si"
                                                : "No"}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.day}>
                                    <View style={styles.day}>
                                        <Text>
                                            Observacion Gratuita:{" "}
                                            {dataForm.servicios.observaciones
                                                ? "Si"
                                                : "No"}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.day}>
                                    <View style={styles.day}>
                                        <Text>
                                            Otros:{" "}
                                            {dataForm.servicios.otros
                                                ? "Si"
                                                : "No"}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.day}>
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

export default ViewSolicitudes;
