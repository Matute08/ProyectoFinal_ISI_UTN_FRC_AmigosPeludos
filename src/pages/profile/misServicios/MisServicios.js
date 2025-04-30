import React, { useState, useEffect } from "react";
import { getPaseador, getCuidadores, getVeterinarias, getFundacion } from "../../../services/commonApi";
import { getUserMail, updateUser } from "../../../services/userApi";
import {
    Col,
    Row,
    TabPane,
    CardBody,
    TabContent,
    NavLink,
    NavItem,
    Card,
    CardHeader,
    Nav,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import ServicioPaseador from "./ServicioPaseador";
import ServicioCuidador from "./ServicioCuidador";
import ServicioVeterinaria from "./ServicioVeterinaria";
import Loading from "../../components/Loading";
import ServicioFundacion from "./ServicioFundacion";

const MisServicios = () => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [paseadores, setPaseadores] = useState([]);
    const [cuidadores, setCuidadores] = useState([]);
    const [veterinarias, setVeterinarias] = useState([]);
    const [fundaciones, setFundaciones] = useState([]);
    const [activeTab, setActiveTab] = useState("1");
    const [activityTab, setActivityTab] = useState("1");

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };
    const daysOfWeek = [
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
        "domingo",
    ];
    const timePeriods = ["manana", "tarde", "noche"];
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
                datosUsuario.data.calle = `${
                    datosUsuario.data.calle + " " + datosUsuario.data.nroCalle
                }`;
                setUserData(datosUsuario.data);
            }
        };

        fetchUserData();
    }, [userData]);

    useEffect(() => {
        const fetchServicios = async () => {
            if (userData) {
                try {
                    const dataPaseador = (await getPaseador()) || [];
                    const dataCuidador = (await getCuidadores()) || [];
                    const dataVeterinaria = (await getVeterinarias()) || [];
                    const dataFundacion = (await getFundacion()) || [];

                    // Filtrar paseadores, cuidadores y veterinarias según el userData.id
                    const paseadoresFiltrados = dataPaseador.data.filter(
                        (paseador) => paseador.idUsuario === userData.id
                    );
                    const cuidadoresFiltrados = dataCuidador.data.filter(
                        (cuidador) => cuidador.idUsuario === userData.id
                    );
                    const veterinariasFiltradas = dataVeterinaria.data.filter(
                        (veterinaria) => veterinaria.idUsuario === userData.id
                    );
                    const fundacionesFiltradas = dataFundacion.data.filter(
                        (fundacion) => fundacion.idUsuario === userData.id
                    );

                    setPaseadores(paseadoresFiltrados.data);
                    setCuidadores(cuidadoresFiltrados.data);
                    setVeterinarias(veterinariasFiltradas.data);
                    setFundaciones(fundacionesFiltradas.data);
                } catch (error) {
                    console.error("Error al obtener datos:", error);
                }
            }

        };

        fetchServicios();
    }, [userData, userData?.id, veterinarias]);

    return (
        <React.Fragment>
            {userData &&
            (userData.esPaseador ||
                userData.esCuidador ||
                userData.esVeterinaria ||
                userData.esFundacion) ? (
                <Nav
                    className="nav-tabs-custom rounded card-header-tabs border-bottom-0 justify-content-start"
                    role="tablist"
                >
                    {userData && userData.esPaseador ? (
                        <NavItem>
                            <NavLink
                                href="#paseador"
                                className={`d-md-inline-block ${
                                    activeTab === "1" ? "active" : ""
                                }`}
                                onClick={() => {
                                    toggleTab("1");
                                }}
                            >
                                <span className="d-md-inline-block">
                                    Paseador
                                </span>
                            </NavLink>
                        </NavItem>
                    ) : (
                        ""
                    )}

                    {userData && userData.esCuidador ? (
                        <NavItem>
                            <NavLink
                                href="#cuidador"
                                className={`d-md-inline-block ${
                                    activeTab === "2" ? "active" : ""
                                }`}
                                onClick={() => {
                                    toggleTab("2");
                                }}
                            >
                                <span className=" d-md-inline-block">
                                    Cuidador
                                </span>
                            </NavLink>
                        </NavItem>
                    ) : (
                        ""
                    )}

                    {userData && userData.esVeterinaria ? (
                        <NavItem>
                            <NavLink
                                href="#veterinaria"
                                className={`d-md-inline-block ${
                                    activeTab === "3" ? "active" : ""
                                }`}
                                onClick={() => {
                                    toggleTab("3");
                                }}
                            >
                                <span className=" d-md-inline-block">
                                    Veterinaria
                                </span>
                            </NavLink>
                        </NavItem>
                    ) : (
                        ""
                    )}

                    {userData && userData.esFundacion ? (
                        <NavItem>
                            <NavLink
                                href="#fundacion"
                                className={`d-md-inline-block ${
                                    activeTab === "4" ? "active" : ""
                                }`}
                                onClick={() => {
                                    toggleTab("4");
                                }}
                            >
                                <span className=" d-md-inline-block">
                                    Fundación
                                </span>
                            </NavLink>
                        </NavItem>
                    ) : (
                        ""
                    )}
                </Nav>
            ) : (
                ""
            )}

            <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                    <ServicioPaseador></ServicioPaseador>
                </TabPane>
                <TabPane tabId="2">
                    <ServicioCuidador></ServicioCuidador>
                </TabPane>
                <TabPane tabId="3">
                    <ServicioVeterinaria></ServicioVeterinaria>
                </TabPane>
                <TabPane tabId="4">
                    <ServicioFundacion></ServicioFundacion>
                </TabPane>
            </TabContent>
        </React.Fragment>
    );
};

export default MisServicios;
