import { React, useState, useEffect } from "react";
import {
    Card,
    CardBody,
    Col,
    Container,
    Input,
    Label,
    Row,
    Table,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    DropdownMenu,
    DropdownItem,
    CardHeader,
} from "reactstrap";
import Swal from "sweetalert2"; // Importa SweetAlert2
import classnames from "classnames";
import { Link, useNavigate } from "react-router-dom";

import Footer from "../../landing/Footer";
import Navbar from "../../landing/Navbar";
import {
    getUserMail,
    getEstadosFormularios,
    getVeterinarias,
    updateVeterinaria,
    getEstadosVeterinaria,
    updateEstadoVeterinaria,
    getFundacion,
} from "../../../services/api";
import { useAuth } from "../../../services/AuthContext";
import Loading from "../../components/Loading";
import SolicitudesFundacion from "./SolicitudesFundacion";
import SolicitudesVeterinaria from "./SolicitudesVeterinaria";

const Solicitudes = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("1");
    const [formularioSolicitado, setFormularioSolicitado] = useState();
    const [fundacionSolicitado, setFundacionSolicitado] = useState();
    const [pdfItemId, setPDFItemId] = useState(null);
    const [userData, setUserData] = useState();
    const [estados, setEstados] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFormDetails, setSelectedFormDetails] = useState(null);
    const [showPDF, setShowPDF] = useState(false);
    const navigate = useNavigate();
    const [notificacionesVete, setNotificacionesVete] = useState(0);
    const [notificacionesFunda, setNotificacionesFunda] = useState(0);

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedFormData, setSelectedFormData] = useState(null);

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            // Obtener los datos del usuario desde el localStorage
            const cachedUserData = localStorage.getItem("userData");

            if (cachedUserData) {
                // Parsear los datos almacenados en el localStorage
                const dataLocalStorage = JSON.parse(cachedUserData);

                // Acceder al correo electrónico del usuario
                const userEmail = dataLocalStorage.email;

                const datosUsuario = await getUserMail(userEmail);
                datosUsuario.calle = `${
                    datosUsuario.calle + " " + datosUsuario.nroCalle
                }`;
                setUserData(datosUsuario);
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // notificaciones veterinarias
    useEffect(() => {
        const fetchFormDataSolicitado = async () => {
            try {
                // Obtener datos de veterinarias
                const publicData = await getVeterinarias();

                // Filtrar las veterinarias en estado 1
                const veterinariasEnEstado1 = publicData.filter(
                    (veterinaria) => veterinaria.estadoId === 1
                );

                // Obtener el número de veterinarias en estado 1
                setNotificacionesVete(veterinariasEnEstado1.length);

                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener datos de veterinarias:", error);
            }
        };

        // Verificar si hay un usuario válido antes de hacer la solicitud
        if (userData && userData.id) {
            fetchFormDataSolicitado();
        }
    }, [userData]);


    //notificaciones fundaciones

    useEffect(() => {
        const fetchFormDataSolicitado = async () => {
            try {
                // Obtener datos de fundaciones
                const fundacionData = await getFundacion();

                // Filtrar las fundaciones en estado deseado (por ejemplo, estadoId === 1)
                const fundacionesEnEstadoDeseado = fundacionData.filter(
                    (fundacion) => fundacion.estadoId === 1
                );

                // Obtener el número de fundaciones en el estado deseado
                setNotificacionesFunda(fundacionesEnEstadoDeseado.length);

                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener datos de fundaciones:", error);
            }
        };

        // Verificar si hay un usuario válido antes de hacer la solicitud
        if (userData && userData.id) {
            fetchFormDataSolicitado();
        }
    }, [userData]);

    document.title = "Solicitudes de Servicios | Amigos Peludos";

    return (
        <>
            <Navbar></Navbar>

            <div className="page-content perfil-fondo">
                <Container fluid className="contenedor-form">
                    {/* Fila 1 titulo */}
                    <Row>
                        <Col className=" d-flex justify-content-center titulo-consult-pest ">
                            <h1>Solicitudes de Servicios</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader>
                                    <Nav
                                        className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                        role="tablist"
                                    >
                                        <NavItem>
                                            <NavLink
                                                href="#Veterinarias"
                                                className={`d-md-inline-block ${
                                                    activeTab === "1"
                                                        ? "active"
                                                        : ""
                                                }`}
                                                onClick={() => {
                                                    toggleTab("1");
                                                }}
                                            >
                                                <span className=" d-md-inline-block">
                                                    Solicitudes Veterinarias
                                                    {notificacionesVete > 0 && (
                                                        <span className="circulo-rojo">
                                                            {" "}
                                                            {notificacionesVete}
                                                        </span>
                                                    )}
                                                </span>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                href="#Fundaciones"
                                                className={`d-md-inline-block ${
                                                    activeTab === "2"
                                                        ? "active"
                                                        : ""
                                                }`}
                                                onClick={() => {
                                                    toggleTab("2");
                                                }}
                                            >
                                                <span className=" d-md-inline-block">
                                                    Solicitudes Fundaciones
                                                    {notificacionesFunda > 0 && (
                                                        <span className="circulo-rojo">
                                                            {" "}
                                                            {notificacionesFunda}
                                                        </span>
                                                    )}
                                                </span>
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </CardHeader>

                                <CardBody>
                                    <TabContent activeTab={activeTab}>
                                        <TabPane tabId="1">
                                            <SolicitudesVeterinaria></SolicitudesVeterinaria>
                                        </TabPane>

                                        <TabPane tabId="2">
                                            <SolicitudesFundacion></SolicitudesFundacion>
                                        </TabPane>
                                    </TabContent>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer></Footer>
        </>
    );
};

export default Solicitudes;
