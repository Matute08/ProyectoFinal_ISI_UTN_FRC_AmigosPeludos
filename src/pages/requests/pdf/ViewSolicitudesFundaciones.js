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
import { getFundacionId } from "../../../services/commonApi";
import Loading from "../../components/Loading";

const styles = StyleSheet.create({
    container: {
        padding: 10,
        fontFamily: "Helvetica",
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
    respuesta: {
        width: "100%",
    },
});

const ViewSolicitudesFundaciones = () => {
    const { id } = useParams();
    const [dataForm, setDataForm] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [imagenFundacion, setImagenFundacion] = useState();
    const [nombreDueño, setNombreDueño] = useState();

    useEffect(() => {
        const fetchForm = async () => {
            console.log(id);
            if (id) {
                try {
                    const data = await getFundacionId(id);
                    setDataForm(data);
                    setImagenFundacion(data ? data.imagen : null);
                    if (data && data.datosUsuario && data.datosUsuario.nombreCompleto) {
                        setNombreDueño(data.datosUsuario.nombreCompleto);
                    }
                    
                    setIsLoading(false);
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setIsLoading(false);
                }
            }
        };

        fetchForm();
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
                                                    Nombre de la Fundación:
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
                                                    {nombreDueño}
                                                </Text>
                                            </View>

                                            <View style={styles.item}>
                                                <Text style={styles.label}>
                                                    CUIT:
                                                </Text>
                                                <Text>
                                                    {dataForm
                                                        ? dataForm.cuit                                                        : ""}
                                                </Text>
                                            </View>

                                            <View style={styles.item}>
                                                <Text style={styles.label}>
                                                    Celular:
                                                </Text>
                                                <Text>
                                                    {dataForm
                                                        ? dataForm.telefono
                                                        : ""}
                                                </Text>
                                            </View>

                                            <View style={styles.item}>
                                                <Text style={styles.label}>
                                                    Dirección:
                                                </Text>
                                                <Text>
                                                    {dataForm
                                                        ? `${dataForm.direccion} ${dataForm.nroCalle}`
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
                                                        : ""}
                                                </Text>
                                            </View>
                                            <View style={styles.item}>
                                                <Text style={styles.label}>
                                                    Alias CBU:
                                                </Text>
                                                <Text>
                                                    {dataForm
                                                        ? dataForm.aliasCbu
                                                        : ""}
                                                </Text>
                                            </View>
                                            {/* Redes sociales */}
                                            <View style={styles.item}>
                                                <Text style={styles.label}>
                                                    Pagina Web:
                                                </Text>
                                                <Text>
                                                    {dataForm
                                                        ? dataForm.paginaUrl
                                                        : ""}
                                                </Text>
                                            </View>

                                            <View style={styles.item}>
                                                <Text style={styles.label}>
                                                    Facebook:
                                                </Text>
                                                <Text>
                                                    {dataForm
                                                        ? dataForm.facebook
                                                        : ""}
                                                </Text>
                                            </View>

                                            <View style={styles.item}>
                                                <Text style={styles.label}>
                                                    Instagram:
                                                </Text>
                                                <Text>
                                                    {dataForm
                                                        ? dataForm.instagram
                                                        : ""}
                                                </Text>
                                            </View>

                                            {/* descripcion fundacion */}
                                            <View style={styles.item}>
                                                <Text style={styles.label}>
                                                    Descripcion de la fundación:{" "}
                                                    {dataForm
                                                        ? dataForm.descripcion
                                                        : ""}
                                                </Text>
                                                
                                            </View>

                                            {/* descripcion dinero  */}
                                            <View style={styles.item}>
                                                <Text style={styles.label}>
                                                    Utilizacion del dinero de
                                                    donación:{" "}
                                                    {dataForm
                                                        ? dataForm.motivoDonaciones
                                                        : ""}
                                                </Text>
                                                
                                            </View>

                                            {/* fecha de creacion */}
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

export default ViewSolicitudesFundaciones;
