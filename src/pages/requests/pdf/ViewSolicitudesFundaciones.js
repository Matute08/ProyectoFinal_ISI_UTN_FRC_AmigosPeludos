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
import {
    getFormulariosId,
    getVeterinariaId,
    getFundacionId,
} from "../../../services/api";
import Loading from "../../components/Loading";

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
                                    <Page style={styles.container}>
                                        <View>
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
                                                    Descripcion de la fundación:
                                                </Text>
                                                <Text style={styles.respuesta}>
                                                    {"\n"}
                                                    {dataForm
                                                        ? dataForm.descripcion
                                                        : ""}
                                                </Text>
                                            </View>

                                            {/* descripcion dinero  */}
                                            <View style={styles.item}>
                                                <Text style={styles.label}>
                                                    Utilizacion del dinero de
                                                    donación:
                                                </Text>
                                                <Text style={styles.respuesta}>
                                                    {"\n"}
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
