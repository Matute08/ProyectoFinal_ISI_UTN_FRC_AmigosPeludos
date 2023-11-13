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
import { getFormulariosId, getVeterinariaId } from "../../../services/api";
import Loading from "../../components/Loading";

const styles = StyleSheet.create({
    container: {
        padding: 10,
        fontFamily: "Helvetica",
        //marginVertical:20
    },

    border: {
        border: 2,
        borderColor: "black",
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
        margin: 15,
        fontWeight: "bold",
    },
    label: {
        fontWeight: "bold",
        marginBottom: 5,
        marginRight: 10,
        fontSize: 14,
        marginLeft: 10,
    },
    item: {
        marginBottom: 5,
        fontSize: 14,
        width: "100%",
        display: "flex",
        flexDirection: "row", // Cambio aquí
        //justifyContent: "space-between",  // Añadido para espacio entre etiquetas y valores
    },
    day: {
        fontWeight: "bold",
        marginBottom: 5,
        marginRight: 10,
        fontSize: 14,
        marginLeft: 10,
    },
    containerDiv: {
        height: "100vh",
        border: 3,
        borderColor: "black",
    },
    subTitle: {
        fontSize: 18,
        margin: 10,
        fontWeight: 'bold', // Hace que el texto sea negrita
    textDecoration: 'underline',
    },
});

const ViewSolicitudesVeterinarias = () => {
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
        <>
            {!isLoading ? (
                <>
                    <div style={styles.containerDiv}>
                        {dataForm && (
                            <PDFViewer width="100%" height="100%">
                                <Document>
                                    <Page size="A4" style={styles.container}>
                                        <View style={styles.border}>
                                            <Text style={styles.title}>
                                                Solicitud de Servicio
                                            </Text>
                                            <Image
                                                style={styles.image}
                                                src={logo}
                                            />

                                            <View style={styles.item}>
                                                <Text style={styles.label}>
                                                    ID Solicitud:
                                                </Text>
                                                <Text>
                                                    {dataForm
                                                        ? `${dataForm.id}`
                                                        : ""}
                                                </Text>
                                            </View>

                                            <View style={styles.item}>
                                                <Text style={styles.label}>
                                                    Nombre de la Veterinaria:
                                                </Text>
                                                <Text>
                                                    {dataForm
                                                        ? `${dataForm.nombre}`
                                                        : ""}
                                                </Text>
                                            </View>

                                            <View style={styles.item}>
                                                <Text style={styles.label}>
                                                    Nombre del Dueño:
                                                </Text>
                                                <Text>
                                                    {dataForm &&
                                                    dataForm.datosUsuario
                                                        ? `${dataForm.datosUsuario.nombreCompleto}`
                                                        : ""}
                                                </Text>
                                            </View>

                                            <View style={styles.item}>
                                                <Text style={styles.label}>
                                                    CUIT:
                                                </Text>
                                                <Text>
                                                    {dataForm
                                                        ? dataForm.cuil
                                                        : ""}
                                                </Text>
                                            </View>

                                            <View style={styles.item}>
                                                <Text style={styles.label}>
                                                    Celular:
                                                </Text>
                                                <Text>
                                                    {dataForm
                                                        ? dataForm.numeroTelefono
                                                        : ""}
                                                </Text>
                                            </View>

                                            <View style={styles.item}>
                                                <Text style={styles.label}>
                                                    Dirección:
                                                </Text>
                                                <Text>
                                                    {dataForm
                                                        ? `${dataForm.direccion} ${dataForm.numeroCalle}`
                                                        : ""}
                                                </Text>
                                            </View>

                                            <View style={styles.item}>
                                                <Text style={styles.label}>
                                                    Barrio:
                                                </Text>
                                                <Text>
                                                    {dataForm
                                                        ? dataForm.barrio
                                                        : ""}
                                                </Text>
                                            </View>

                                            <View style={styles.item}>
                                                <Text style={styles.label}>
                                                    CBU:
                                                </Text>
                                                <Text>
                                                    {dataForm
                                                        ? dataForm.cbu
                                                        : "No recibe donaciones"}
                                                </Text>
                                            </View>

                                            
                                                <View style={styles.item}>
                                                    <Text style={styles.label}>
                                                        Fecha de Creación:
                                                    </Text>
                                                    <Text>
                                                        {dataForm
                                                            ? formatDate(
                                                                  dataForm.fechaAlta
                                                              )
                                                            : ""}
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
                                                        {dataForm.horarios
                                                            ?.lunes ||
                                                            "Cerrado"}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.item}>
                                                <View style={styles.day}>
                                                    <Text>
                                                        Martes:{" "}
                                                        {dataForm.horarios
                                                            ?.martes ||
                                                            "Cerrado"}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.item}>
                                                <View style={styles.day}>
                                                    <Text>
                                                        Miércoles:{" "}
                                                        {dataForm.horarios
                                                            ?.miercoles ||
                                                            "Cerrado"}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.item}>
                                                <View style={styles.day}>
                                                    <Text>
                                                        Jueves:{" "}
                                                        {dataForm.horarios
                                                            ?.jueves ||
                                                            "Cerrado"}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.item}>
                                                <View style={styles.day}>
                                                    <Text>
                                                        Viernes:{" "}
                                                        {dataForm.horarios
                                                            ?.viernes ||
                                                            "Cerrado"}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={styles.item}>
                                                <View style={styles.day}>
                                                    <Text>
                                                        Sábado:{" "}
                                                        {dataForm.horarios
                                                            ?.sabado ||
                                                            "Cerrado"}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={styles.item}>
                                                <View style={styles.day}>
                                                    <Text>
                                                        Domingo:{" "}
                                                        {dataForm.horarios
                                                            ?.domingo ||
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

                                            <View style={styles.item}>
                                                <View style={styles.label}>
                                                    <Text>
                                                        Castraciones:{" "}
                                                        {dataForm.servicios
                                                            .castraciones
                                                            ? "Si"
                                                            : "No"}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={styles.item}>
                                                <View style={styles.label}>
                                                    <Text>
                                                        Internaciones:{" "}
                                                        {dataForm.servicios
                                                            .internaciones
                                                            ? "Si"
                                                            : "No"}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.item}>
                                                <View style={styles.label}>
                                                    <Text>
                                                        Vacunaciones:{" "}
                                                        {dataForm.servicios
                                                            .vacunaciones
                                                            ? "Si"
                                                            : "No"}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.item}>
                                                <View style={styles.label}>
                                                    <Text>
                                                        Equipos para extracción:{" "}
                                                        {dataForm.servicios
                                                            .equipoLaboratorio
                                                            ? "Si"
                                                            : "No"}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.item}>
                                                <View style={styles.label}>
                                                    <Text>
                                                        Radiografias:{" "}
                                                        {dataForm.servicios
                                                            .radiografias
                                                            ? "Si"
                                                            : "No"}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.item}>
                                                <View style={styles.label}>
                                                    <Text>
                                                        Ecografias:{" "}
                                                        {dataForm.servicios
                                                            .ecografias
                                                            ? "Si"
                                                            : "No"}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.item}>
                                                <View style={styles.label}>
                                                    <Text>
                                                        Guardias 24hs:{" "}
                                                        {dataForm.servicios
                                                            .guardia24hs
                                                            ? "Si"
                                                            : "No"}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.item}>
                                                <View style={styles.label}>
                                                    <Text>
                                                        Emergencias a Domicilio:{" "}
                                                        {dataForm.servicios
                                                            .emergencias
                                                            ? "Si"
                                                            : "No"}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.item}>
                                                <View style={styles.label}>
                                                    <Text>
                                                        Observacion Gratuita:{" "}
                                                        {dataForm.servicios
                                                            .observaciones
                                                            ? "Si"
                                                            : "No"}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.item}>
                                                <View style={styles.label}>
                                                    <Text>
                                                        Otros:{" "}
                                                        {
                                                            dataForm.servicios
                                                                .otros
                                                        }
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </Page>
                                </Document>
                            </PDFViewer>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <Loading></Loading>
                </>
            )}
        </>
    );
};

export default ViewSolicitudesVeterinarias;
